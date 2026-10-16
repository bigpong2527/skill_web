'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewProps {
  content: string;
}

export default function MarkdownView({ content }: MarkdownViewProps) {
  return (
    <div className="prose prose-sm max-w-none text-slate-600 dark:text-gray-300">
      <ReactMarkdown
        components={{
          // SEO CRITICAL: Downgrade all heading levels to preserve single H1 per page
          // The skill name is the only H1, markdown content starts at H2
          h1: ({ children }) => (
            <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mt-6 mb-4 border-b border-slate-200 dark:border-white/10 pb-2">{children}</h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100 mt-5 mb-3 flex items-center gap-2">
              <span className="h-5 w-1 bg-blue-500 rounded-full"></span>
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mt-4 mb-2">{children}</h4>
          ),
          p: ({ children }) => <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-300">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-slate-600 dark:text-slate-300">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-slate-600 dark:text-slate-300">{children}</ol>,
          li: ({ children }) => <li className="text-slate-600 dark:text-slate-300 marker:text-blue-500">{children}</li>,
          code: ({ children }) => (
            <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-white/5">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-slate-900 dark:bg-[#0d1117] p-4 rounded-lg mb-4 overflow-x-auto border border-slate-800 dark:border-white/5">
              <code className="text-sm font-mono text-slate-300">{children}</code>
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 my-4 bg-slate-50/70 dark:bg-white/[0.02] text-slate-700 dark:text-slate-300 italic">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4 rounded-lg border border-slate-200 dark:border-white/5">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-slate-100 dark:bg-slate-800/50 px-4 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-white/5">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-b border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}