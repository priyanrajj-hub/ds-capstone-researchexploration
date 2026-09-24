import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePanelProps {
    code: string;
    activeLine?: number;
}

export function CodePanel({ code, activeLine }: CodePanelProps) {
    return (
        <div className="bg-[#1d1f21] rounded-xl border border-white/10 overflow-hidden text-sm h-full w-full">
            <SyntaxHighlighter
                language="typescript"
                style={atomDark}
                wrapLines={true}
                showLineNumbers={true}
                lineProps={(lineNumber) => ({
                    style: {
                        display: 'block',
                        backgroundColor: lineNumber === activeLine ? 'rgba(28, 114, 147, 0.4)' : 'transparent',
                        borderLeft: lineNumber === activeLine ? '4px solid #1C7293' : '4px solid transparent',
                    }
                })}
                customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
