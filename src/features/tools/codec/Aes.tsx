import React, { useState, useCallback } from 'react';
import ToolLayout from '../../../layouts/ToolLayout';
import { showToast } from '../../../components/ui/Toast';

/* ---- Styles ---- */
const btnBase: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 10,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  boxShadow: '0 2px 0 var(--border-color)',
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: 'var(--color-blue)',
  color: '#fff',
  borderColor: 'var(--color-blue)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  fontFamily: 'var(--font-sans)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid var(--border-color)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  width: 200,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  padding: '8px 12px',
};

const controlRow: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  marginBottom: 12,
  alignItems: 'flex-end',
};

const controlCol: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

function padKey(key: string): ArrayBuffer {
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(key);
  let targetLen = 16;
  if (keyBytes.length > 24) targetLen = 32;
  else if (keyBytes.length > 16) targetLen = 24;

  const padded = new Uint8Array(targetLen);
  padded.fill(0);
  const copyLen = Math.min(keyBytes.length, targetLen);
  padded.set(keyBytes.subarray(0, copyLen));
  return padded.buffer as ArrayBuffer;
}

async function aesEncrypt(plaintext: string, key: string, iv: string, mode: 'CBC' | 'ECB'): Promise<string> {
  const keyBuf = padKey(key);
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const algo = mode === 'ECB' ? 'AES-ECB' : 'AES-CBC';
  const importParams: AesKeyGenParams = { name: algo, length: keyBuf.byteLength * 8 };
  const cryptoKey = await crypto.subtle.importKey('raw', keyBuf, importParams, false, ['encrypt']);

  const encrypted = await crypto.subtle.encrypt(
    mode === 'CBC'
      ? { name: 'AES-CBC', iv: padIv(iv) } as AesCbcParams
      : { name: 'AES-ECB' } as AlgorithmIdentifier,
    cryptoKey,
    data,
  );
  return arrayBufferToBase64(encrypted);
}

async function aesDecrypt(ciphertext: string, key: string, iv: string, mode: 'CBC' | 'ECB'): Promise<string> {
  const keyBuf = padKey(key);
  const data = base64ToArrayBuffer(ciphertext);

  const algo = mode === 'ECB' ? 'AES-ECB' : 'AES-CBC';
  const importParams: AesKeyGenParams = { name: algo, length: keyBuf.byteLength * 8 };
  const cryptoKey = await crypto.subtle.importKey('raw', keyBuf, importParams, false, ['decrypt']);

  const decrypted = await crypto.subtle.decrypt(
    mode === 'CBC'
      ? { name: 'AES-CBC', iv: padIv(iv) } as AesCbcParams
      : { name: 'AES-ECB' } as AlgorithmIdentifier,
    cryptoKey,
    data,
  );
  return new TextDecoder().decode(decrypted);
}

function padIv(iv: string): Uint8Array {
  const encoder = new TextEncoder();
  const ivBytes = encoder.encode(iv);
  const padded = new Uint8Array(16);
  padded.fill(0);
  const copyLen = Math.min(ivBytes.length, 16);
  padded.set(ivBytes.subarray(0, copyLen));
  return padded;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function Aes() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [mode, setMode] = useState<'CBC' | 'ECB'>('CBC');
  const [activeAction, setActiveAction] = useState<'encrypt' | 'decrypt' | null>(null);

  const handleEncrypt = useCallback(async () => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    if (!key.trim()) { setError('请输入加密密钥'); return; }
    setActiveAction('encrypt');
    setError('');
    try {
      const result = await aesEncrypt(input, key, iv, mode);
      setOutput(result);
      showToast('加密成功', 'success');
    } catch (e) {
      setError('加密失败: ' + (e instanceof Error ? e.message : '未知错误'));
      setOutput('');
    }
  }, [input, key, iv, mode]);

  const handleDecrypt = useCallback(async () => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    if (!key.trim()) { setError('请输入解密密钥'); return; }
    setActiveAction('decrypt');
    setError('');
    try {
      const result = await aesDecrypt(input, key, iv, mode);
      setOutput(result);
      showToast('解密成功', 'success');
    } catch (e) {
      setError('解密失败，请检查密钥和密文是否正确');
      setOutput('');
    }
  }, [input, key, iv, mode]);

  const handleInput = (value: string) => {
    setInput(value);
    setOutput('');
    setError('');
    setActiveAction(null);
  };

  const controls = (
    <div>
      <div style={labelStyle}>加密设置</div>
      <div style={controlRow}>
        <div style={controlCol}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>密钥 (Key)</span>
          <input
            style={inputStyle}
            type="text"
            placeholder="输入密钥..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        {mode === 'CBC' && (
          <div style={controlCol}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>IV (可选)</span>
            <input
              style={inputStyle}
              type="text"
              placeholder="初始向量 (IV)..."
              value={iv}
              onChange={(e) => setIv(e.target.value)}
            />
          </div>
        )}
        <div style={controlCol}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>加密模式</span>
          <select
            style={selectStyle}
            value={mode}
            onChange={(e) => setMode(e.target.value as 'CBC' | 'ECB')}
          >
            <option value="CBC">CBC</option>
            <option value="ECB">ECB</option>
          </select>
        </div>
        <div style={{ ...controlCol, justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={activeAction === 'encrypt' ? btnActive : btnBase}
              onClick={handleEncrypt}
            >
              加密
            </button>
            <button
              style={activeAction === 'decrypt' ? btnActive : btnBase}
              onClick={handleDecrypt}
            >
              解密
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ToolLayout
      toolId="codec-aes"
      title="AES加密解密"
      description="使用AES算法对文本进行加密和解密，支持CBC和ECB加密模式，密钥自动填充至16/24/32字节"
      inputValue={input}
      onInputChange={handleInput}
      outputValue={output}
      inputPlaceholder="在此输入要加密或解密的文本..."
      error={error}
      children={controls}
    />
  );
}
