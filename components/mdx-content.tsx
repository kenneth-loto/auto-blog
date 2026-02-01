"use client";

import Link from "next/link";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import type { ComponentPropsWithoutRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const components = {
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (!href) {
      return <span {...props}>{children}</span>;
    }

    const isExternal = href.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex font-normal text-blue-500 no-underline"
        >
          {children}
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="h-4 w-4 translate-y-1"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.75 4H6v1.5h3.44L5.47 9.47l-.53.53L6 11.06l.53-.53 3.97-3.97V10H12V5a1 1 0 0 0-1-1z"
            />
          </svg>
        </a>
      );
    }

    return (
      <Link href={href} className="text-blue-500 no-underline font-normal">
        {children}
      </Link>
    );
  },

  Avatar,
  Button,

  code: ({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"code">) => {
    const isCodeBlock = className?.includes("language-");

    return (
      <code
        {...props}
        className={cn(
          "font-mono",
          !isCodeBlock && "bg-muted text-foreground rounded px-1.5 py-0.5",
          className,
        )}
      >
        {children}
      </code>
    );
  },

  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre {...props} className="bg-primary text-primary-foreground rounded-lg">
      {children}
    </pre>
  ),

  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li {...props} className="marker:text-muted-foreground">
      {children}
    </li>
  ),

  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className="list-disc pl-6 space-y-2 my-4 marker:text-lg">
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol {...props} className="list-decimal pl-6 space-y-2 my-4">
      {children}
    </ol>
  ),
};

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

export function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote {...source} components={components} />;
}
