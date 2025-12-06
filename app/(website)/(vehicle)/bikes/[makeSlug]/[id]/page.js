// app/bike/[id]/page.jsx (or wherever your route is)
import ProductGallery from "@/components/pages/specification/ProductGallery";
import VehicleCard from "@/components/vehicle/vehicleCard";
import ShareButton from "../../components/Sharebutton";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

// ✅ Generate Metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const { id, makeSlug } = params;

    const host = (await headers()).get("host") || "informreaders.com";
    const alternates = buildHreflangLinks(`/bikes/${makeSlug}/${id}`, host);

    const response = await axiosInstance.get(`/website/bike/${id}`);
    const data = response?.data?.data;

    if (!data) return { title: "Bike Not Found | InformReaders" };

    // Extract bike details
    const { makeId, year, description, technicalSpecs } = data;
    let make = makeId.name;
    let fuelType = technicalSpecs.find((spec) => spec.name.toLowerCase() === "fuel type")?.value;
    let bodyType = technicalSpecs.find((spec) => spec.name.toLowerCase() === "body type")?.value;

    // Meta Title Variations (under 60 chars)
    const metaTitles = [
      `${make} ${year} – Full Bike Specifications & Features`,
      `${make} ${year} ${bodyType} | Specs, Mileage & Price`,
      `${make} ${year} – ${fuelType} Bike Specs & Details`,
      `Complete ${make} ${year} Bike Specifications & Review`,
      `${make} ${year} ${bodyType} Features, Specs & Variants`,
      `${year} ${make} – Mileage, Engine, and Specifications`,
      `${make} ${year} ${fuelType} Bike | Specs & Highlights`,
      `Full Details of ${make} ${year} – Price & Specifications`,
      `${make} ${year} – Complete ${bodyType} Bike Overview`,
      `${make} ${year} Specs – Engine, Mileage & Features`,
    ];

    // Meta Description Variations (150–160 chars)
    const metaDescriptions = [
      `Discover the complete specifications of ${make} ${year}, including engine, mileage, design, and key features of this ${fuelType} ${bodyType} bike.`,
      `Explore ${make} ${year} ${bodyType} bike with full details on performance, fuel type, engine, and features. Get all specs in one place.`,
      `Looking for ${make} ${year} details? Check out mileage, engine, ${fuelType} system, and complete specifications for this ${bodyType} bike.`,
      `${make} ${year} offers powerful performance with ${fuelType} engine and stylish ${bodyType} design. View full specifications and key highlights.`,
      `Find everything about the ${make} ${year} – specifications, engine, mileage, and features of this popular ${fuelType} ${bodyType} bike.`,
      `Get the latest specs of ${make} ${year}. Learn about its ${fuelType} engine, ${bodyType} design, mileage, and unique performance features.`,
      `Discover why ${make} ${year} is a top choice. Check mileage, engine details, design, and full specifications of this ${fuelType} ${bodyType} bike.`,
      `${make} ${year} bike specifications, performance insights, and fuel efficiency details. Explore all key features of this stylish ${bodyType} model.`,
      `Learn about ${make} ${year} – from ${fuelType} engine and mileage to ${bodyType} design and features. Full specifications available here.`,
      `${make} ${year} combines performance and comfort. Check engine specs, mileage, design, and all key highlights of this ${bodyType} bike.`,
    ];

    // Randomly pick a variation
    const randomTitle = metaTitles[Math.floor(Math.random() * metaTitles.length)];
    const randomDescription =
      metaDescriptions[Math.floor(Math.random() * metaDescriptions.length)] || description;

    return {
      title: randomTitle,
      description: randomDescription,
      alternates,
    };
  } catch (error) {
    return { title: "Bike Details | InformReaders" };
  }
}

// ✅ Fetch data on the server
async function fetchBikeData(id) {
  try {
    const response = await axiosInstance.get(`/website/bike/${id}`);
    if (response.data.error) return null;
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

function getBikeFaqs({ make, year, fuelType, bodyType }) {
  const faqs = [
    {
      q: `What are the key specifications of the ${make} ${year}?`,
      a: `The ${make} ${year} comes with a ${fuelType} engine and a ${bodyType} design. It is built for performance, comfort, and durability, making it a reliable choice for riders.`,
    },
    {
      q: `Is the ${make} ${year} suitable for long-distance rides?`,
      a: `Yes, the ${make} ${year} is designed to handle both city commutes and long-distance travel, thanks to its efficient ${fuelType} system and ergonomic ${bodyType}.`,
    },
    {
      q: `How fuel-efficient is the ${make} ${year}?`,
      a: `The fuel efficiency depends on riding style and road conditions, but the ${make} ${year} is known for delivering impressive mileage in the ${fuelType} category.`,
    },
    {
      q: `What makes the ${make} ${year} unique compared to other bikes in its class?`,
      a: `The ${make} ${year} stands out due to its ${bodyType} design, reliable ${fuelType} engine, and advanced features that provide both comfort and performance.`,
    },
    {
      q: `Does the ${make} ${year} require high maintenance?`,
      a: `No, the ${make} ${year} is designed for easy maintenance with durable components and a service-friendly structure. Regular servicing ensures long-lasting performance.`,
    },
    {
      q: `Is the ${make} ${year} good for beginners?`,
      a: `Absolutely! The ${make} ${year} is easy to handle, lightweight in its ${bodyType} structure, and offers smooth control, making it an excellent choice for new riders.`,
    },
    {
      q: `What type of riders is the ${make} ${year} best suited for?`,
      a: `The ${make} ${year} caters to riders who prefer reliable performance, stylish design, and practical fuel efficiency, whether for daily commutes or weekend rides.`,
    },
    {
      q: `Can I use the ${make} ${year} for off-road riding?`,
      a: `The ${make} ${year} is primarily a ${bodyType} bike, best suited for urban and highway rides. However, with proper handling, it can manage light off-road conditions.`,
    },
    {
      q: `What safety features does the ${make} ${year} offer?`,
      a: `The ${make} ${year} includes essential safety features such as strong braking systems, durable tires, and a stable ${bodyType} frame, ensuring rider security.`,
    },
    {
      q: `Is the ${make} ${year} available in multiple colors and variants?`,
      a: `Yes, the ${make} ${year} is offered in different variants and colors to match rider preferences, while still maintaining the same powerful ${fuelType} engine.`,
    },
  ];

  // Shuffle and pick 3 random FAQs
  const shuffled = faqs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

function getIntroParagraph({ bikeName, make, year, bodyType, fuelType }) {
  const intros = [
    `The ${bikeName} by ${make}, (${year}), stands out in the market for its balance of design and performance. This ${bodyType} motorcycle is powered by a dependable ${fuelType} engine, offering smooth handling and excellent fuel economy. Riders often compare specifications to ensure they choose a bike that suits their lifestyle, whether for commuting, touring, or recreational rides. Detailed specs highlight the engine’s efficiency, the comfort of the ${bodyType}, and the overall riding experience. By reviewing these details, buyers can make well-informed decisions that align with their needs.`,

    `Motorcycle enthusiasts are always on the lookout for models that combine style with performance, and the ${bikeName} from ${make} (${year}) does just that. This ${bodyType} is equipped with a ${fuelType} engine designed to deliver reliability on both short city rides and long journeys. Specifications provide a deeper understanding of what makes this bike unique—its design, efficiency, and practicality. For riders comparing options, the full specs give valuable insights into how the ${bikeName} performs in real-world conditions.`,

    `The ${bikeName}, manufactured by ${make} in ${year}, is a ${bodyType} motorcycle built to deliver exceptional riding experiences. Powered by a ${fuelType} engine, this  ensures performance and durability. Specifications are an essential guide for anyone considering a bike purchase, as they highlight features that matter most—engine type, build quality, and riding comfort. By exploring the specs of the ${bikeName}, riders can evaluate how well it fits their expectations and road conditions.`,

    `In the world of motorcycles, the ${bikeName} by ${make} (${year}) makes a strong impression as a ${bodyType} powered by a ${fuelType} engine. Whether you’re a daily commuter or an adventure rider, knowing the full specifications can help you understand the bike’s strengths. Details such as fuel type, body style, and design elements reveal how this motorcycle balances performance and practicality. Reviewing the complete specs ensures that riders get a clear picture before making a decision.`,

    `The ${bikeName} (${year}) from ${make} is a ${bodyType} motorcycle designed for riders who demand both performance and comfort. Its ${fuelType} engine provides reliability, making it suitable for diverse riding conditions. Specifications act as a roadmap for buyers, showing exactly how the bike performs in terms of efficiency, durability, and ride quality. Riders looking for long-term value often depend on full specifications to compare models and make the right choice.`,

    `Every motorcycle tells a story through its specifications, and the ${bikeName} by ${make} (${year}) is no exception. This ${bodyType} runs on a ${fuelType} engine, offering riders an experience that blends efficiency with performance. From urban commutes to highway travel, the specs reveal important aspects such as design, body structure, and overall handling. By understanding these details, riders can determine how well the ${bikeName} fits their style and requirements.`,

    `The ${bikeName}, introduced by ${make} in ${year}, is a ${bodyType} motorcycle crafted for modern riders. Its ${fuelType} engine powers the  with smooth performance and dependable mileage. Specifications serve as a key tool for evaluating whether a bike meets one’s needs. For enthusiasts and first-time buyers alike, reviewing the specs provides valuable insights into efficiency, comfort, and durability, ensuring that the ${bikeName} stands out in its category.`,

    `When it comes to motorcycles, the ${bikeName} (${year}) from ${make} has earned attention as a ${bodyType} that balances form and function. With a ${fuelType} engine, it delivers consistent performance across various riding conditions. Specifications shed light on its design, body structure, and real-world reliability. For riders considering their options, full specifications make it easier to compare features and select a bike that truly matches their expectations.`,

    `The ${bikeName} by ${make}, model  (${year}), demonstrates how modern engineering meets rider needs. As a ${bodyType}, it is powered by a ${fuelType} engine designed for efficiency and durability. Specifications are critical for understanding what makes this motorcycle unique, from its body design to its riding comfort. By analyzing these details, buyers can confidently assess whether the ${bikeName} aligns with their lifestyle and road conditions.`,

    `Motorcycle specifications help riders make informed choices, and the ${bikeName} from ${make} (${year}) is a prime example. This ${bodyType}, featuring a ${fuelType} engine, delivers reliability and adaptability for various riding styles. Specifications highlight the bike’s core strengths, including its design, engine efficiency, and overall usability. Riders who carefully study these details can determine if the ${bikeName} is the right choice for their commuting, touring, or leisure needs.`,
  ];

  // Pick one random intro
  return intros[Math.floor(Math.random() * intros.length)];
}

function BikeFaqs({ make, model, year, fuelType, bodyType }) {
  const faqs = getBikeFaqs({ make, model, year, fuelType, bodyType });

  if (!faqs.length) {
    return (
      <div id="faqs" className="pt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <p className="text-gray-500 text-center py-8">No FAQs available for this product yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="faqs" className="pt-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold text-gray-800">{faq.q}</p>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SpecificationDetail({ params }) {
  const { id, makeSlug } = params;
  const result = await fetchBikeData(id);

  if (!result?.data) return notFound();

  const data = result.data;
  const related = result.related || [];

  const sections = [
    {
      title: "General Information",
      keys: [
        "body type",
        "bike category",
        "seating capacity",
        "length",
        "width",
        "height",
        "wheelbase",
        "ground clearance",
        "dry weight",
        "fuel tank capacity",
        "battery capacity",
        "curb weight",
        "seat height",
        "charging time",
        "battery type",
        "starting system",
      ],
    },
    {
      title: "Engine Specifications",
      keys: [
        "powertrain architecture",
        "fuel type",
        "Engine Type",
        "engine displacement",
        "power",
        "torque",
        "bore x stroke",
        "engine size",
        "compression",
        "fuel system",
        "engine cooling",
        "engine oil capacity",
        "Battery Voltage (Electric)",
        "Motor Power (Electric)",
        "Electric Start",
        "gearbox",
      ],
    },
    {
      title: "Performance",
      keys: ["top speed", "acceleration 0 - 100 km/h", "weight to power ratio", "weight to torque ratio"],
    },
    { title: "Fuel Economy and Emissions (ICE)", keys: ["fuel consumption", "co", "emission standard"] },
    {
      title: "Drivetrain and Transmission",
      keys: ["drivetrain architecture", "drive wheel", "transmission type", "clutch type"],
    },
    {
      title: "Suspension and Brakes",
      keys: [
        "front suspension",
        "rear suspension",
        "Front brakes",
        "front brakes",
        "rear brakes",
        "abs",
        "traction control",
      ],
    },
    {
      title: "Steering and Tires",
      keys: ["steering type", "driveline", "front tire size", "rear tire size", "wheel type", "wheel size"],
    },
    {
      title: "Additional Features",
      keys: ["frame type", "Instrument Cluster", "Features", "headlight", "Storage"],
    },
  ];

  const specMap = {};
  [...(data.technicalSpecs || []), ...(data.featureAndSafety || []), ...(data.evsFeatures || [])].forEach(
    (spec) => {
      if (spec.name) specMap[spec.name] = spec.value || "---";
    }
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Bikes", href: "/bikes" },
    { label: data?.makeId?.name, href: `/bikes/${makeSlug}` },
    { label: data?.name },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 pb-12">
      <Breadcrumb items={breadcrumbItems} />
      {/* Product Title */}
      <section className="mb-6 flex justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{data?.name}</h1>
        {/* Share button stays a client component */}
        <ShareButton data={data} />
      </section>
      <p className="mt-4 text-gray-700">
        {getIntroParagraph({
          bikeName: data?.name,
          make: data?.makeId?.name,
          year: data?.year,
          bodyType: data?.technicalSpecs.find((spec) => spec.name.toLowerCase() === "body type")?.value,
          fuelType: data?.technicalSpecs.find((spec) => spec.name.toLowerCase() === "fuel type")?.value,
        })}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Product Gallery */}
        <div className="md:col-span-4">
          <ProductGallery images={[]} mainImage={data?.image} />
        </div>

        {/* Right Column - Specifications */}
        <div className="md:col-span-8">
          {sections.map((section) => {
            const sectionSpecs = section.keys.map((key) => ({
              name: key,
              value: specMap[key] || "---",
            }));

            return (
              <div key={section.title} className="mb-6">
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 transition-all hover:shadow-md">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 capitalize">{section.title}</h2>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-gray-700">
                      <tbody>
                        {sectionSpecs.map((item, index) => (
                          <tr
                            key={index}
                            className="odd:bg-gray-50 even:bg-white border-b border-gray-100 last:border-0"
                          >
                            <td className="px-4 py-3 font-medium capitalize text-gray-900">{item.name}</td>
                            <td className="px-4 py-3">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}

          {/* FAQs Section */}
          <BikeFaqs
            bodyType={data?.technicalSpecs.find((spec) => spec.name.toLowerCase() === "body type")?.value}
            fuelType={data?.technicalSpecs.find((spec) => spec.name.toLowerCase() === "fuel type")?.value}
            make={data?.makeId?.name}
            year={data?.year}
          />
        </div>
      </div>

      {/* Related Vehicles */}
      <div className="mt-16 space-y-6">
        <h2 className="text-2xl font-bold text-center mb-8">Related Vehicles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {related.length > 0 ? (
            related.map((vehicle) => <VehicleCard vehicle={vehicle} key={vehicle?._id} type="bikes" />)
          ) : (
            <p className="text-gray-500 text-center col-span-full">No related vehicles found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
