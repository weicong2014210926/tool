import React, { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';

function autoFix(text: string): string {
  if (!text) return '';
  let result = text;
  // Add space between Chinese and English
  result = result.replace(/([\u4e00-\u9fff\u3400-\u4dbf])([a-zA-Z])/g, '$1 $2');
  result = result.replace(/([a-zA-Z])([\u4e00-\u9fff\u3400-\u4dbf])/g, '$1 $2');
  // Add space between Chinese and numbers
  result = result.replace(/([\u4e00-\u9fff\u3400-\u4dbf])(\d)/g, '$1 $2');
  result = result.replace(/(\d)([\u4e00-\u9fff\u3400-\u4dbf])/g, '$1 $2');
  // Full-width to half-width (except CJK-specific punctuation)
  result = result.replace(/\uFF0C/g, ',');  // fullwidth comma
  result = result.replace(/\uFF1A/g, ':');  // fullwidth colon
  result = result.replace(/\uFF1B/g, ';');  // fullwidth semicolon
  result = result.replace(/\uFF08/g, '(');  // fullwidth left parenthesis
  result = result.replace(/\uFF09/g, ')');  // fullwidth right parenthesis
  result = result.replace(/\uFF01/g, '!');  // fullwidth exclamation
  result = result.replace(/\uFF1F/g, '?');  // fullwidth question
  // Remove extra blank lines (>2 consecutive newlines -> reduce to 2)
  result = result.replace(/\n{3,}/g, '\n\n');
  // Trim trailing whitespace on each line
  result = result.split('\n').map((line) => line.trimEnd()).join('\n');
  return result;
}

export default function Typesetting() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    setOutput(autoFix(input));
  }, [input]);

  return (
    <ToolLayout
      toolId="text-typesetting"
      title="中英文排版纠正器"
      description="自动纠正中英文混排时的标点符号、空格等排版问题，符合排版规范"
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      inputPlaceholder="在此粘贴中英文混排文本..."
    />
  );
}
