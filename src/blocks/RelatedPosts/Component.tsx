/* eslint-disable */
import RichText from "@/components/RichText";
import { cn } from "@/utilities/cn";

import { Card } from "../../components/Card";

import type { Blog } from "@/payload-types";

export type RelatedPostsProps = {
  className?: string;
  docs?: Blog[];
  introContent?: any;
};

export const RelatedPosts = (props: RelatedPostsProps) => {
  const { className, docs, introContent } = props;

  return (
    <div className={cn("lg:container", className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-8">
        {docs?.map((doc, index) => {
          if (typeof doc === "string") return null;

          return <Card key={index} doc={doc} relationTo="blogs" showCategories />;
        })}
      </div>
    </div>
  );
};
