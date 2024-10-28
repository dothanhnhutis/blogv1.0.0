import React from "react";
import Image from "next/image";
import Link from "next/link";

import { ChevronDownIcon, MenuIcon } from "lucide-react";
const DefaultLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <header className="sticky top-0 left-0 right-0 bg-white">
        <div className=" flex items-center justify-between mx-auto max-w-[1350px] p-2">
          <button type="button" className="min-[900px]:hidden">
            <MenuIcon className="size-7 shrink-0" />
          </button>
          <nav className="min-[900px]:hidden absolute top-full left-0 right-0 bg-white overflow-y-scroll max-h-[calc(100vh_-_72px)] flex flex-col text-gray-500 uppercase font-semibold text-base">
            <Link
              href="/"
              className="hover:text-primary hover:bg-primary-foreground px-2 py-1"
            >
              Trang Chủ
            </Link>
            <Link
              href="/gioi-thieu"
              className="hover:text-primary hover:bg-primary-foreground px-2 py-1"
            >
              Giới Thiệu
            </Link>
            <Link
              href="/quy-trinh-gia-cong"
              className="hover:text-primary hover:bg-primary-foreground px-2 py-1"
            >
              Quy Trình Gia Công
            </Link>
            <div>
              <div className="flex items-center justify-between hover:text-primary hover:bg-primary-foreground pl-2 pr-1 py-1">
                <Link
                  href="/san-pham-gia-cong"
                  className="hover:text-primary hover:bg-primary-foreground "
                >
                  Sản Phẩm Gia Công
                </Link>
                <ChevronDownIcon className="shrink-0 size-5" />
              </div>
              <ul className="capitalize font-normal">
                <li>
                  <div className="flex items-center justify-between hover:text-primary hover:bg-primary-foreground pl-4 pr-1 py-1">
                    <Link href="/">Chăm Sóc Da Mặt</Link>
                    <ChevronDownIcon className="shrink-0 size-5" />
                  </div>
                  <div>
                    <Link
                      href="/"
                      className="hover:text-primary hover:bg-primary-foreground pl-6 block"
                    >
                      Kem Face
                    </Link>
                    <Link
                      href="/"
                      className="hover:text-primary hover:bg-primary-foreground pl-6 block"
                    >
                      Serum
                    </Link>
                    <Link
                      href="/"
                      className="hover:text-primary hover:bg-primary-foreground pl-6 block"
                    >
                      Kem Chống Nắng
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center justify-between hover:text-primary hover:bg-primary-foreground">
                <Link
                  href="/tin-tuc"
                  className="hover:text-primary hover:bg-primary-foreground p-2"
                >
                  Tin Tức
                </Link>
                <ChevronDownIcon className="shrink-0 size-5" />
              </div>
              <div className="capitalize font-normal">
                <Link
                  href="/"
                  className="hover:text-primary hover:bg-primary-foreground pl-4 pr-1 py-1 block"
                >
                  Tin Tức Nổi Bật
                </Link>
                <Link
                  href="/"
                  className="hover:text-primary hover:bg-primary-foreground pl-4 pr-1 py-1 block"
                >
                  Cập Nhật Xu Hướng Mỹ phẩm
                </Link>

                <Link
                  href="/"
                  className="hover:text-primary hover:bg-primary-foreground pl-4 pr-1 py-1 block"
                >
                  Gia Công Mỹ Phẩm
                </Link>
                <Link
                  href="/"
                  className="hover:text-primary hover:bg-primary-foreground pl-4 pr-1 py-1 block"
                >
                  Mẫu Chai
                </Link>
                <Link
                  href="/"
                  className="hover:text-primary hover:bg-primary-foreground pl-4 pr-1 py-1 block"
                >
                  Tuyển Dụng
                </Link>
              </div>
            </div>

            <Link
              href="/lien-he"
              className="hover:text-primary hover:bg-primary-foreground px-2 py-1"
            >
              Liên Hệ
            </Link>
          </nav>
          <Image
            src="/logo.png"
            alt="logo.png"
            width="100"
            height="100"
            className="size-14 shrink-0"
          />

          <nav className="hidden min-[900px]:flex items-center justify-center gap-5 text-gray-500 uppercase font-semibold text-base">
            <Link href="/" className="hover:text-primary">
              Trang Chủ
            </Link>
            <Link href="/gioi-thieu" className="hover:text-primary">
              Giới Thiệu
            </Link>
            <Link href="/quy-trinh-gia-cong" className="hover:text-primary">
              Quy Trình Gia Công
            </Link>

            <Link href="/lien-he" className="hover:text-primary">
              Liên Hệ
            </Link>
          </nav>
          <div>search</div>
        </div>
      </header>
      <main>{children}</main>
      <footer>asdas</footer>
    </>
  );
};

export default DefaultLayout;
