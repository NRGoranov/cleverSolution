"use client";

import { useEffect, useState } from "react";
import {
  INQUIRY_EVENT,
  readInquiry,
  type InquiryItem,
} from "@/lib/inquiry";

export function useInquiry() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readInquiry());
    sync();
    setReady(true);
    window.addEventListener(INQUIRY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(INQUIRY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { items, ready };
}
