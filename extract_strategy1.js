const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function extractStrategy1() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // portfolio.html 파일의 절대 경로
        const htmlPath = path.resolve(__dirname, 'portfolio.html');
        const fileUrl = `file://${htmlPath}`;
        
        await page.goto(fileUrl, {
            waitUntil: 'networkidle0'
        });
        
        // 전략1 박스 요소 찾기
        const strategy1Box = await page.$('.test-thumbnail-box.strategy1-box');
        
        if (!strategy1Box) {
            throw new Error('전략1 박스를 찾을 수 없습니다.');
        }
        
        // 요소의 위치와 크기 가져오기
        const boundingBox = await strategy1Box.boundingBox();
        
        if (!boundingBox) {
            throw new Error('전략1 박스의 크기를 가져올 수 없습니다.');
        }
        
        // 스크린샷 찍기 (고해상도)
        const screenshot = await strategy1Box.screenshot({
            type: 'jpeg',
            quality: 95,
            path: path.resolve(__dirname, 'strategy1-1.jpg')
        });
        
        console.log('전략1-1 이미지가 성공적으로 추출되었습니다: strategy1-1.jpg');
        console.log(`크기: ${boundingBox.width} x ${boundingBox.height}px`);
        
    } catch (error) {
        console.error('오류 발생:', error.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

extractStrategy1();


