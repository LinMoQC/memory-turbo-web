import React, { Fragment, Suspense } from "react";
import ReviewList from "./_components/ReviewList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Memory Flow - 模版审核',
}

export default function ReviewPage() {
  return (
    <div className="w-full p-6 bg-gray-50 dark:bg-gray-950 h-[92vh] overflow-y-auto relative">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 dark:text-light">待审批模版</h2>
      <ReviewList />
    </div>
  );
}