#!/usr/bin/env python3
"""
觅火 MIIFIRE · 字体子集生成脚本
====================================
用法: python3 scripts/generate-font-subset.py

作用:
  1. 宋体：从本机完整思源宋体（SourceHanSerifCN），生成覆盖「GB2312 全集 + 所有项目字符
     + 常用标点 + ASCII」的子集
  2. 黑体：只保留字母 + 数字 + 空格（标点交给宋体，避免中文标点被黑体抢走）

血泪教训（详见 runtime/fonts/README.md）:
  坑1: 子集太小 → 新字回退系统字体
  坑2: 标点被黑体抢走 → 黑体只留字母数字
  坑3: Options.flavor 对 CFF 不生效 → 用 font.flavor 属性（否则输出 TTF 白屏）
  坑4: 字体缓存 → 文件名加版本号 cache-busting

依赖: pip install fonttools
字体源: ~/Library/Fonts/SourceHanSerifCN-{Regular,Medium,Bold}.ttf
"""

from fontTools.subset import Subsetter
from fontTools.ttLib import TTFont
import glob
import os

# 字体版本号：每次更新字体内容后 +1（v2 → v3 → …），并同步改 portrait.css 里的 url
VERSION = 'v2'


def collect_chars():
    """收集需要覆盖的全部字符：所有项目字符 + GB2312 全集 + 常用标点 + ASCII"""
    chars = set()

    # 1. 所有项目的 slides + content.md 里用到的字符
    for f in glob.glob('projects/*/slides/*.html') + glob.glob('projects/*/content.md'):
        with open(f, 'r', encoding='utf-8') as fh:
            chars.update(fh.read())

    # 2. GB2312 全部汉字（6763 字，覆盖日常场景）
    for i in range(0xB0, 0xF8):
        for j in range(0xA1, 0xFF):
            try:
                chars.add(bytes([i, j]).decode('gb2312'))
            except Exception:
                pass

    # 3. 常用中文标点 + 特殊符号
    chars.update('，。、：；？！""''（）【】《》〈〉「」『』…—～·→–— 　')

    # 4. ASCII 可打印字符（保险起见，数字英文虽由黑体覆盖，宋体里也保留）
    chars.update(chr(c) for c in range(0x20, 0x7F))
    chars.add('\n')

    return chars


def generate_sans(out_dir):
    """重新生成黑体子集（Inter）：只保留字母 + 数字 + 空格，去掉所有标点。
    原因：Inter 自带 · – — “ ” … 等标点，会抢走中文标点、和宋体中文不协调；
    标点一律交给宋体（字体栈里黑体排第一，黑体里没有就会回退到宋体）。"""
    chars = ''.join(chr(c) for c in range(0x30, 0x3A))  # 0-9
    chars += ''.join(chr(c) for c in range(0x41, 0x5B))  # A-Z
    chars += ''.join(chr(c) for c in range(0x61, 0x7B))  # a-z
    chars += ' '

    for weight in ['400', '500', '700']:
        path = os.path.join(out_dir, f'miifire-sans-{weight}.{VERSION}.woff2')
        if not os.path.exists(path):
            print(f'✗ 缺少黑体源: {path}（黑体一般不需要重新生成，跳过）')
            continue
        font = TTFont(path)
        ss = Subsetter()
        ss.populate(text=chars)
        ss.subset(font)
        font.flavor = 'woff2'
        font.save(path)
        print(f'✓ 生成 miifire-sans-{weight}.{VERSION}.woff2: {os.path.getsize(path)} 字节（只保留字母数字）')


def main():
    # 宋体字重映射（源文件名 → 字重）
    mapping = [
        ('SourceHanSerifCN-Regular.ttf', '400'),
        ('SourceHanSerifCN-Medium.ttf', '500'),
        ('SourceHanSerifCN-Bold.ttf', '700'),
    ]
    src_dir = os.path.expanduser('~/Library/Fonts/')
    out_dir = 'runtime/fonts/'

    text = ''.join(sorted(collect_chars()))
    print(f'子集字符总数: {len(text)}')

    # 输出字符清单，供 QA 校验字体覆盖（validate-project.js 读它）
    charset_file = os.path.join(out_dir, 'charset.txt')
    with open(charset_file, 'w', encoding='utf-8') as fh:
        fh.write(text)
    print(f'✓ 输出字符清单: {charset_file}')

    for src_name, weight in mapping:
        src = os.path.join(src_dir, src_name)
        if not os.path.exists(src):
            print(f'✗ 缺少字体源: {src}')
            continue
        out = os.path.join(out_dir, f'miifire-serif-{weight}.{VERSION}.woff2')
        font = TTFont(src)
        ss = Subsetter()
        ss.populate(text=text)
        ss.subset(font)
        font.flavor = 'woff2'  # 关键：用 flavor 属性（Options.flavor 对 CFF 字体不生效，会输出 TTF）
        font.save(out)
        print(f'✓ 生成 miifire-serif-{weight}.{VERSION}.woff2: {os.path.getsize(out)} 字节')

    print()
    generate_sans(out_dir)

    print(f'\n完成。版本号: {VERSION}。')
    print('若改了字体内容：记得 VERSION +1，并同步改 portrait.css 里的字体 url。')


if __name__ == '__main__':
    main()
