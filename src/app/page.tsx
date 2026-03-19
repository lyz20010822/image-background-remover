'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件（JPG、PNG、WEBP）');
      return;
    }

    // 验证文件大小（最大 25MB）
    if (file.size > 25 * 1024 * 1024) {
      setError('图片大小不能超过 25MB');
      return;
    }

    setError(null);
    setProcessedImage(null);

    // 显示原图预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!originalImage || !fileInputRef.current?.files?.[0]) {
      setError('请先选择一张图片');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', fileInputRef.current.files[0]);

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `处理失败：${response.status}`);
      }

      // 获取处理后的图片
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'no-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🖼️ 图片背景移除工具
              </h1>
              <p className="text-gray-600 mt-1">
                基于 AI 的智能抠图，一键去除图片背景
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                ⚡ 快速处理
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                🔒 安全隐私
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              上传图片
            </h2>
            <p className="text-gray-600">
              支持 JPG、PNG、WEBP 格式，最大 25MB
            </p>
          </div>

          {/* Drop Zone */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {originalImage ? (
              <div className="space-y-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
                <p className="text-gray-600">
                  点击重新选择图片
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">📁</div>
                <div>
                  <p className="text-lg text-gray-700 font-medium">
                    点击或拖拽上传图片
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    图片将在内存中处理，不会存储到服务器
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                  选择图片
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            {originalImage && !processedImage && (
              <button
                onClick={handleRemoveBackground}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    处理中...
                  </>
                ) : (
                  <>
                    ✨ 去除背景
                  </>
                )}
              </button>
            )}

            {processedImage && (
              <>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  🔄 重新上传
                </button>
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  ⬇️ 下载图片
                </button>
              </>
            )}
          </div>
        </div>

        {/* Result Section */}
        {processedImage && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              处理结果
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">
                  原图
                </h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <img
                    src={originalImage!}
                    alt="Original"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              </div>

              {/* Processed */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">
                  去背后
                </h3>
                <div className="bg-gray-100 rounded-lg p-4" style={{
                  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}>
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              快速处理
            </h3>
            <p className="text-gray-600">
              基于 AI 的智能算法，通常在几秒内完成背景移除
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              安全隐私
            </h3>
            <p className="text-gray-600">
              图片在内存中处理，不会存储到服务器，保护您的隐私
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              免费额度
            </h3>
            <p className="text-gray-600">
              每月 50 张免费处理额度，超出后仅需 $0.20/张
            </p>
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            使用步骤
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-medium text-gray-800 mb-2">上传图片</h3>
              <p className="text-gray-600 text-sm">
                选择或拖拽要处理的图片
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-medium text-gray-800 mb-2">去除背景</h3>
              <p className="text-gray-600 text-sm">
                点击按钮，AI 自动处理
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-medium text-gray-800 mb-2">下载结果</h3>
              <p className="text-gray-600 text-sm">
                预览并下载去背后的图片
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>
            基于 Next.js + TailwindCSS 构建 | Powered by Remove.bg API
          </p>
          <p className="text-sm mt-2">
            Made with 🦞 by 飞书用户 7250WA 的助手
          </p>
        </div>
      </footer>
    </main>
  );
}
