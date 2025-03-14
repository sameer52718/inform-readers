import Image from "next/image";
import Link from "next/link";

export default function GameCard() {
  return (
    <div className="bg-[#d9d9d9] px-4 pt-4 rounded-xl w-full mb-4 shadow-md">
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Image Section */}
        <div className="w-full flex justify-center md:justify-start">
          <Image
            src="/website/assets/images/specifacationCard/game/01.png"
            alt="Red Dead Redemption 2"
            width={1000}
            height={1000}
            className="rounded-lg w-full max-w-[250px] h-60 object-contain"
          />
        </div>

        {/* Text Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-600 underline">
            <Link href={"#"}>Red Dead Redemption 2</Link>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
            {[
              "/website/assets/images/specifacationCard/game/icon-2.png",
              "/website/assets/images/specifacationCard/game/icon-1.png",
              "/website/assets/images/specifacationCard/game/icon-3.png",
              "/website/assets/images/specifacationCard/game/icon-4.png"
            ].map((icon, index) => (
              <div key={index} className="flex items-center gap-2">
                <Image src={icon} alt="icon" width={1000} height={1000} className="w-8 sm:w-10 h-8 sm:h-10" />
                <span className="text-gray-600 text-sm sm:text-base">Modes: Single-player, Multiplayer</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-black mx-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Release Date */}
          <div className="flex flex-col items-center py-3 border-b sm:border-b-0 sm:border-r border-black">
            <span className="text-black text-base font-semibold">Release Date</span>
            <span className="text-gray-600 text-sm font-semibold">17th January 2024</span>
          </div>

          {/* Button */}
          <div className="flex justify-center items-center py-3">
            <button className="bg-red-500 text-white px-4 py-3 rounded-lg text-sm font-semibold">
              CHECK IT NOW
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
