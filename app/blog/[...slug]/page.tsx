import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { ArrowLeft, FileX } from "lucide-react";
import Link from "next/link";
import { serialize } from "next-mdx-remote/serialize";
import { MDXContent } from "@/components/mdx-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatDate } from "@/lib/utils";

interface BlogDetailsParams {
  slug: string[];
}

interface BlogDetailsPageProps {
  params: Promise<BlogDetailsParams>;
}

export default async function BlogDetailsPage({
  params,
}: BlogDetailsPageProps) {
  const { slug } = await params;

  if (!slug) return null;

  const fileName = slug[0];
  const filePath = path.join(
    process.cwd(),
    "public",
    "blogs",
    `${fileName}.mdx`,
  );

  try {
    const source = await fs.readFile(filePath, "utf-8");
    const { content, data: frontmatter } = matter(source);
    const mdxSource = await serialize(content);

    return (
      <main className="max-w-4xl mx-auto py-16 px-6 md:px-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-16 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <article className="prose dark:prose-invert text-primary max-w-none">
          <header className="not-prose mb-8 border-b pb-4">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-6">
                <time
                  dateTime={frontmatter.date}
                  className="text-sm text-muted-foreground"
                >
                  {formatDate(frontmatter.date)}
                </time>
                <h1 className="text-primary text-5xl font-semibold leading-tight tracking-tight">
                  {frontmatter.title}
                </h1>
              </div>

              {frontmatter.author && (
                <div className="flex flex-col gap-4">
                  <span className="text-sm text-muted-foreground">
                    Posted by
                  </span>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={frontmatter.author.avatar}
                        alt={frontmatter.author.name}
                      />
                      <AvatarFallback>
                        {frontmatter.author.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {frontmatter.author.name}
                      </span>
                      {frontmatter.author.handle && (
                        <span className="text-xs text-muted-foreground">
                          {frontmatter.author.handle}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>

          <MDXContent source={mdxSource} />
        </article>
      </main>
    );
  } catch {
    return (
      <Empty className="min-h-screen">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileX />
          </EmptyMedia>
          <EmptyTitle>Blog Post Not Found</EmptyTitle>
          <EmptyDescription>
            The blog post you're looking for doesn't exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </EmptyContent>
      </Empty>
    );
  }
}
