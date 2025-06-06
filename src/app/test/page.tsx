import Image from "next/image";

export default function test() {
    return (
        <div className="flex h-screen">
            <div className="hidden lg:block relative flex-[8] rounded-3xl">
                <Image
                    src="/mable.png"
                    alt="Mabel"
                    fill
                    style={{ objectFit: "inherit" }}
                />
            </div>
            <div className="bg-green-200 flex-[4] p-8 sm:p-20 md:p-32 lg:p-36 w-full">
                {/* ใส่เนื้อหาตรงนี้ */}
            </div>
        </div>
    );
}