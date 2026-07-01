/**
 * 构建脚本
 * 用于构建 Xiaomi Vela JS 应用
 */

const fs = require('fs');
const path = require('path');

// 源目录
const srcDir = path.join(__dirname, 'src');

// 输出目录
const distDir = path.join(__dirname, 'dist');

// 创建输出目录
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// 复制文件函数
function copyFileSync(source, target) {
  let targetFile = target;

  // 如果目标是一个目录，则在目录中创建同名文件
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// 复制目录函数
function copyFolderRecursiveSync(source, target) {
  let files = [];

  // 检查目标目录是否存在
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // 检查源目录是否存在
  if (fs.existsSync(source)) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        // 递归复制子目录
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        // 复制文件
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

// 开始构建
console.log('开始构建 Xiaomi Vela JS 应用...');

try {
  // 复制源文件到输出目录
  copyFolderRecursiveSync(srcDir, distDir);
  console.log('构建完成！');
  console.log('输出目录:', distDir);
} catch (error) {
  console.error('构建失败:', error);
}
