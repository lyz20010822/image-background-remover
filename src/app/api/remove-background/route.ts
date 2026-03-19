import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 验证 API Key 是否配置
    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'Remove.bg API key 未配置',
          hint: '请在 .env.local 文件中设置 REMOVEBG_API_KEY'
        },
        { status: 500 }
      );
    }

    // 解析表单数据
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    // 验证文件是否存在
    if (!imageFile) {
      return NextResponse.json(
        { error: '未提供图片，请上传一个图片文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '无效的文件类型，请上传有效的图片（JPG、PNG、WEBP）' },
        { status: 400 }
      );
    }

    // 验证文件大小（Remove.bg 限制 25MB）
    const maxSize = 25 * 1024 * 1024; // 25MB
    const arrayBuffer = await imageFile.arrayBuffer();
    if (arrayBuffer.byteLength > maxSize) {
      return NextResponse.json(
        { error: '文件过大，最大支持 25MB' },
        { status: 413 }
      );
    }

    // 构建 FormData 发送给 Remove.bg
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', new Blob([arrayBuffer]), imageFile.name);
    removeBgFormData.append('size', 'auto'); // 自动选择最佳尺寸

    // 调用 Remove.bg API
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    });

    // 处理 API 错误
    if (!removeBgResponse.ok) {
      let errorMessage = 'Remove.bg API 错误';
      try {
        const errorData = await removeBgResponse.json();
        errorMessage = errorData.errors?.[0]?.title || JSON.stringify(errorData);
      } catch {
        errorMessage = await removeBgResponse.text();
      }

      return NextResponse.json(
        { 
          error: '背景移除失败',
          details: errorMessage,
          status: removeBgResponse.status
        },
        { status: removeBgResponse.status === 402 ? 402 : 500 }
      );
    }

    // 获取处理后的图片
    const processedImage = await removeBgResponse.blob();

    // 返回图片
    return new NextResponse(processedImage, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store', // 不缓存，保护隐私
        'Content-Disposition': 'attachment; filename="no-background.png"',
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
