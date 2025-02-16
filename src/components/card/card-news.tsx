"use client";

import React from "react";
import Link from "next/link";
import { NewsService } from "@/services/newsService";
import { useLoadingStore } from "@/stores/loadingStore";
import formatDate from "@/utils/formatDate";
import { useQueryClient } from "@tanstack/react-query";

import { News } from "@/types/news";
import { cn } from "@/lib/utils";

import AppImage from "../ui/app-image";

type TCardNews = {
  size?: "md" | "lg";
  data?: News;
} & React.HTMLAttributes<HTMLDivElement>;

const CardNews = ({ size = "md", className, data, ...rest }: TCardNews) => {
  const queryClient = useQueryClient();
  const updateLoadingApp = useLoadingStore((state) => state.updateLoading);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-node rounded-2xl bg-white pb-5 shadow-md",
        className
      )}
      {...rest}
    >
      <AppImage
        src={data?.thumbnail ?? "/placeholder.webp"}
        alt="thumbnail news"
        ratio={16 / 9}
        className="rounded-tl-2xl rounded-tr-2xl"
        container="max-h-max"
      />
      <div className="content flex-1 px-5">
        <div className="flex flex-col gap-2">
          <span className="text-secondary">{formatDate(data?.createdAt)}</span>
          <Link
            href={`/tin-tuc/${data?._id}`}
            className="line-clamp-2 cursor-pointer font-medium uppercase hover:underline"
            onMouseEnter={() => {
              if (!data) return;
              queryClient.prefetchQuery({
                queryKey: ["news", data?._id],
                queryFn: async () => NewsService.get(data?._id),
                staleTime: 1000 * 60 * 5,
              });
            }}
            onClick={() => {
              updateLoadingApp(true);
            }}
          >
            {data?.title}
          </Link>
        </div>
        <p
          className={cn("short-description max-xs:hidden", {
            hidden: size === "md",
            "line-clamp-4": size === "lg",
          })}
        >
          {data?.shortDescription}
        </p>
      </div>
    </div>
  );
};

export default CardNews;
