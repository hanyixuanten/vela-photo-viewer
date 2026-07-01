/**
 * 构建脚本
 * 用于构建 Xiaomi Vela JS 应用，生成 .rpk 安装包
 *
 * 使用方式：
 *   node build.js              # 开发模式构建（生成 .debug.rpk）
 *   node build.js --release    # 生产模式构建（生成 .release.rpk，需要签名文件）
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ========== 配置 ==========
const projectDir = __dirname;
const srcDir = path.join(projectDir, 'src');
const distDir = path.join(projectDir, 'dist');
const signDir = path.join(projectDir, 'sign');
const isRelease = process.argv.includes('--release');

// ========== 辅助函数 ==========

/**
 * 执行命令并打印输出
 */
function run(cmd, options = {}) {
  console.log(`\n> ${cmd}`);
  try {
    const output = execSync(cmd, {
      cwd: projectDir,
      stdio: 'inherit',
      ...options,
    });
    return output;
  } catch (error) {
    console.error(`命令执行失败: ${cmd}`);
    process.exit(1);
  }
}

/**
 * 检查 aiot CLI 是否已安装
 */
function isAiotInstalled() {
  try {
    execSync('aiot --version', { cwd: projectDir, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * 检查 node_modules 是否存在且 aiot-toolkit 已安装
 */
function isNodeModulesReady() {
  const aiotBin = path.join(projectDir, 'node_modules', '.bin', 'aiot');
  if (process.platform === 'win32') {
    return fs.existsSync(aiotBin + '.cmd');
  }
  return fs.existsSync(aiotBin);
}

/**
 * 安装项目依赖
 */
function installDependencies() {
  console.log('\n📦 正在安装项目依赖...');
  run('npm install');
}

/**
 * 生成签名文件（用于 release 模式）
 */
function generateSignFiles() {
  if (!fs.existsSync(signDir)) {
    fs.mkdirSync(signDir, { recursive: true });
  }

  const privateKey = path.join(signDir, 'private.pem');
  const certificate = path.join(signDir, 'certificate.pem');

  if (fs.existsSync(privateKey) && fs.existsSync(certificate)) {
    console.log('✅ 签名文件已存在，跳过生成');
    return;
  }

  console.log('\n🔐 正在生成签名文件...');
  const cmd = `openssl req -newkey rsa:2048 -nodes -keyout ${signDir}/private.pem -x509 -days 3650 -out ${signDir}/certificate.pem -subj "/CN=photo-viewer/O=Example/C=CN"`;
  run(cmd);
}

/**
 * 清理构建产物
 */
function cleanDist() {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log('🧹 已清理 dist 目录');
  }
}

/**
 * 查找并展示构建产物
 */
function showBuildResult() {
  if (!fs.existsSync(distDir)) {
    console.error('❌ 构建失败：dist 目录不存在');
    process.exit(1);
  }

  const files = [];
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.rpk')) {
        const stats = fs.statSync(fullPath);
        files.push({
          path: fullPath,
          size: (stats.size / 1024).toFixed(2),
        });
      }
    }
  }

  walkDir(distDir);

  if (files.length > 0) {
    console.log('\n✅ 构建成功！生成的 rpk 文件：');
    files.forEach((f) => {
      console.log(`   📦 ${f.path}  (${f.size} KB)`);
    });
  } else {
    console.warn('\n⚠️ 构建完成，但未在 dist 目录中找到 .rpk 文件');
    console.log('   请检查构建日志是否有错误信息');
  }
}

// ========== 主流程 ==========

function main() {
  const mode = isRelease ? '生产（release）' : '开发（debug）';
  console.log(`\n🚀 Xiaomi Vela JS 应用构建工具`);
  console.log(`📋 构建模式: ${mode}`);
  console.log(`📁 项目目录: ${projectDir}`);

  // 1. 检查 src 目录
  const manifestPath = path.join(srcDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ 未找到 src/manifest.json，请确认项目结构正确');
    process.exit(1);
  }

  // 2. 安装依赖
  if (!isNodeModulesReady()) {
    installDependencies();
  } else {
    console.log('\n✅ 依赖已安装');
  }

  // 3. 检查 aiot 命令是否可用
  if (!isNodeModulesReady()) {
    console.error('❌ aiot-toolkit 安装失败，请手动运行 npm install');
    process.exit(1);
  }

  // 4. 清理旧构建产物
  cleanDist();

  // 5. release 模式需要签名文件
  if (isRelease) {
    generateSignFiles();
  }

  // 6. 执行构建
  console.log(`\n🔨 正在构建 rpk 文件...`);
  if (isRelease) {
    run('npx aiot release');
  } else {
    run('npx aiot build');
  }

  // 7. 展示构建结果
  showBuildResult();

  console.log('\n🎉 完成！');
}

main();
