import Image from "next/image";
import Link from "next/link";

export default function GameCard() {
  return (
    <div className="bg-[#d9d9d9] px-4 pt-4 rounded-xl w-full mb-4 shadow-md grid grid-cols-3 items-center">
      <div className="col-span-1">
        <Image
          src="/website/assets/images/specifacationCard/game/01.png"
          alt="Red Dead Redemption 2"
          width={1000}
          height={1000}
          className="rounded-lg w-full h-60 object-contain"
        />
      </div>

      <div className="col-span-2 pl-4">
        <h2 className="text-2xl font-semibold text-gray-600 underline">
          <Link href={"#"}>
          Red Dead Redemption 2
          </Link>
        </h2>
        <div className=" grid grid-cols-2 gap-2 mt-8">
          <div className="flex items-center col-span-1 gap-2 mb-4">
            <Image
              src={"/website/assets/images/specifacationCard/game/icon-2.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-10 h-10"
            />
            <span className="text-gray-600 text-base ">
              Modes: Single-player, Multiplayer
            </span>
          </div>

          <div className="flex items-center col-span-1 gap-2 mb-4">
            <Image
              src={"/website/assets/images/specifacationCard/game/icon-1.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-10 h-10"
            />
            <span className="text-gray-600 text-base ">
              Modes: Single-player, Multiplayer
            </span>
          </div>

          <div className="flex items-center col-span-1 gap-2 mb-4">
            <Image
              src={"/website/assets/images/specifacationCard/game/icon-3.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-10 h-10"
            />
            <span className="text-gray-600 text-base ">
              Modes: Single-player, Multiplayer
            </span>
          </div>

          <div className="flex items-center col-span-1 gap-2 mb-4">
            <Image
              src={"/website/assets/images/specifacationCard/game/icon-4.png"}
              alt="icon"
              width={1000}
              height={1000}
              className="w-10 h-10"
            />
            <span className="text-gray-600 text-base ">
              Modes: Single-player, Multiplayer
            </span>
          </div>
        </div>
      </div>


      <div className="col-span-3 border-t  border-black mx-4">
        <div className="grid grid-cols-2">
          <div className="flex justify-between flex-col items-center col-span-1 py-3 border-r border-black">
            <span className="text-black text-base font-semibold">Release Date</span>
            <span className=" text-gray-600 text-sm font-semibold">
              17th January 2024
            </span>
          </div>

          <div className="flex justify-center items-center  col-span-1">
            <button className="bg-red-500 text-white px-4 py-4 rounded-lg text-sm font-semibold">
              CHECK IT NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
