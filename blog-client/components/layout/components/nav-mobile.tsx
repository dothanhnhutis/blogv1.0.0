import { ChevronDownIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const NavMobile = () => {
  return (
    <>
      <button type="button">
        <MenuIcon className="size-7 shrink-0" />
      </button>
      <nav className="absolute top-full left-0 right-0 bg-white overflow-y-scroll max-h-[calc(100vh_-_72px)] flex flex-col text-gray-500 uppercase font-semibold text-base">
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
                <div className="hover:text-primary hover:bg-primary-foreground pl-6">
                  <Link href="/">Kem Face</Link>
                </div>
                <div className="hover:text-primary hover:bg-primary-foreground pl-6">
                  <Link href="/">Serum</Link>
                </div>
                <div className="hover:text-primary hover:bg-primary-foreground pl-6">
                  <Link href="/">Kem Chống Nắng</Link>
                </div>
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
    </>
  );
};

export default NavMobile;
