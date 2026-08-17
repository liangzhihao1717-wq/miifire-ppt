#!/usr/bin/env python3
"""
觅火 MIIFIRE · 思源宋体子集生成脚本
====================================
用法: python3 scripts/generate-font-subset.py

作用: 从本机完整思源宋体（SourceHanSerifCN），重新生成覆盖「GB2312 全集 + 所有项目字符
      + 常用标点 + ASCII」的子集，输出到 runtime/fonts/miifire-serif-{400,500,700}.woff2

为什么要这个脚本（血泪教训）:
  字体用子集(subset)来减小体积，但子集只覆盖「生成当时」的字符。
  新增 PPT 项目用了新字 → 子集里没有 → 浏览器静默回退到系统宋体 → 字体不统一。
  本脚本覆盖 GB2312 全集(6763 字)，确保常用汉字都在子集内，从根本上避免这个问题。

依赖: pip install fonttools
字体源: ~/Library/Fonts/SourceHanSerifCN-{Regular,Medium,Bold}.ttf
"""

from fontTools.subset import Subsetter, Options
from fontTools.ttLib import TTFont
import glob
import os


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


def main():
    # 字体源 → 输出文件（字重映射）
    mapping = [
        ('SourceHanSerifCN-Regular.ttf', 'miifire-serif-400.woff2'),
        ('SourceHanSerifCN-Medium.ttf', 'miifire-serif-500.woff2'),
        ('SourceHanSerifCN-Bold.ttf', 'miifire-serif-700.woff2'),
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

    for src_name, out_name in mapping:
        src = os.path.join(src_dir, src_name)
        if not os.path.exists(src):
            print(f'✗ 缺少字体源: {src}')
            continue
        out = os.path.join(out_dir, out_name)
        font = TTFont(src)
        options = Options()
        options.flavor = 'woff2'
        options.desubroutinize = True
        options.hinting = True
        ss = Subsetter(options)
        ss.populate(text=text)
        ss.subset(font)
        font.save(out)
        print(f'✓ 生成 {out_name}: {os.path.getsize(out)} 字节 ({src_name})')

    print('完成。注意: 新字体需重新部署 + 用户端清缓存才能生效。')


if __name__ == '__main__':
    main()
