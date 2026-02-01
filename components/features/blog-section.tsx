import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const blogs = [
  {
    id: 1,
    title: "Designing Better Blog Layouts for Enhanced Readability",
    image: "/images/test.jpeg",
    tags: ["UI", "Design", "UX"],
  },
  {
    id: 2,
    title:
      "Why Readability Matters in Web Design and Development for Beginners Part 1",
    image: "/images/test2.jpg",
    tags: ["Typography", "Frontend"],
  },
  {
    id: 3,
    title: "Using shadcn UI in Next.js Projects: A Comprehensive Guide",
    image: "/images/placeholder.png",
    tags: ["Next.js", "shadcn", "Tailwind"],
  },
];

export function BlogSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-12">
        <h2 className="mb-8 text-2xl font-semibold">Recent Blogs</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`} className="block">
              <Card className="group h-full max-w-sm pt-0 overflow-hidden transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="aspect-video object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                  />
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2 leading-tight font-medium">
                    {blog.title}
                  </CardTitle>

                  <CardDescription className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
