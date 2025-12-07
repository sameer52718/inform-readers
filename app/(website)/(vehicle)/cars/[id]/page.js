import Image from "next/image";
import { Car, Fuel, Gauge, Wrench } from "lucide-react";
import VehicleCard from "@/components/vehicle/vehicleCard";
import ShareButton from "../components/ShareButton";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import { headers } from "next/headers";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";

const metaTemplates = [
  {
    title: "{Car Name} {Make} {Year} Specs: {Body Type} in {country}",
    description:
      "Explore {Car Name} by {Make} ({Year}) in {country}: {Body Type}, {Fuel Type}, {Number of Gears}-gear {Type of Gearbox}. Full specs here!",
  },
  {
    title: "{Make} {Car Name} {Year} {country}: {Fuel Type} {Body Type}",
    description:
      "Discover {Year} {Make} {Car Name} in {country}: {Body Type} with {Fuel Type} and {Number of Gears}-gear {Type of Gearbox}. Check details!",
  },
  {
    title: "{Car Name} {Year} {Body Type} Specs in {country}",
    description:
      "Get specs for {Car Name} ({Year}) in {country}: {Make}, {Body Type}, {Fuel Type}, {Number of Gears}-gear {Type of Gearbox}. Learn more!",
  },
];

function applyMetaTemplate(template, values) {
  return template
    .replace(/{Car Name}/g, values.carName || "")
    .replace(/{Make}/g, values.make || "")
    .replace(/{Year}/g, values.year || "")
    .replace(/{Body Type}/g, values.bodyType || "")
    .replace(/{Fuel Type}/g, values.fuelType || "")
    .replace(/{Number of Gears}/g, values.numberOfGears || "")
    .replace(/{Type of Gearbox}/g, values.gearboxType || "")
    .replace(/{country}/g, values.country || "");
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  // Get country from subdomain
  const host = (await headers()).get("host") || "informreaders.com";
  const country = getCountryName(getCountryCodeFromHost(host));

  try {
    const response = await axiosInstance.get(`/website/vehicle/${id}`);
    const vehicle = response?.data?.data;

    if (!vehicle) {
      return {
        title: "Vehicle Details | InformReaders",
        description: "Explore detailed specifications and features of vehicles worldwide.",
      };
    }

    // Extract data
    const carName = vehicle?.name || "";
    const make = vehicle?.makeId?.name || "";
    const year = vehicle?.year || "";
    const bodyType = vehicle?.technicalSpecs?.find((s) => s.name.toLowerCase() === "body type")?.value || "";
    const fuelType = vehicle?.technicalSpecs?.find((s) => s.name.toLowerCase() === "fuel type")?.value || "";
    const gearbox =
      vehicle?.technicalSpecs?.find((s) => s.name.toLowerCase().includes("gearbox"))?.value || "";

    // Split gearbox (e.g., "6-speed Manual")
    let numberOfGears = "";
    let gearboxType = "";
    if (gearbox) {
      const match = gearbox.match(/(\d+).*(manual|automatic|cvt|dct|amt|at|mt)/i);
      if (match) {
        numberOfGears = match[1];
        gearboxType = match[2];
      } else {
        gearboxType = gearbox;
      }
    }

    const values = {
      carName,
      make,
      year,
      bodyType,
      fuelType,
      numberOfGears,
      gearboxType,
      country,
    };

    // Pick random template
    const chosen = metaTemplates[Math.floor(Math.random() * metaTemplates.length)];
    const title = applyMetaTemplate(chosen.title, values);
    const description = applyMetaTemplate(chosen.description, values);

    return {
      title,
      description,
    };
  } catch (error) {
    return {
      title: "Vehicle Details | InformReaders",
      description: "Explore car specifications, features, and details by InformReaders.",
    };
  }
}

// ✅ SSR data fetch
async function getVehicleData(id) {
  try {
    const response = await axiosInstance.get(`/website/vehicle/${id}`);
    if (response.data.error) return null;
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

const introTemplates = [
  `The {Car Name} by {Make}, model {Model} from {Year}, is a {Body Type} designed to deliver both performance and practicality. Powered by a reliable {Fuel Type} engine, this vehicle caters to drivers looking for efficiency, comfort, and durability. With a focus on modern design and smart engineering, the specifications highlight everything buyers need to know about how the car performs in different driving conditions.`,
  `For those seeking a balance between style and performance, the {Car Name} from {Make}, {Model} {Year}, offers a complete package. As a {Body Type} with a {Fuel Type} setup, it is built to handle both daily commutes and long-distance travel. Reviewing its specifications gives buyers insights into performance, comfort features, and long-term reliability.`,
  `The {Car Name}, manufactured by {Make}, launched as the {Model} in {Year}, is a standout option in the {Body Type} category. Equipped with a {Fuel Type} engine, it is engineered to provide drivers with efficiency and dependability. Detailed specifications reveal how this car compares in terms of design, performance, and overall usability.`,
  `When it comes to choosing the right {Body Type}, the {Car Name} by {Make}, {Model} {Year}, emerges as a strong candidate. With its {Fuel Type} engine and practical design, this car is tailored for drivers who prioritize fuel economy, comfort, and modern features. Exploring the specifications helps buyers make informed decisions about ownership.`,
  `The {Car Name} from {Make}, model {Model} released in {Year}, reflects innovation and quality in the {Body Type} segment. Built with a {Fuel Type} engine, it blends performance with efficiency. Car enthusiasts and everyday drivers alike can benefit from reviewing its specifications to understand the strengths of this vehicle.`,
  `Car buyers searching for versatility will find the {Car Name} by {Make}, {Model} {Year}, a reliable {Body Type}. Powered by a {Fuel Type} engine, it offers smooth performance and practicality. Specifications give a clear picture of the car’s design, efficiency, and durability, making it easier for buyers to compare with competitors.`,
  `The {Car Name}, produced by {Make}, comes in the {Model} {Year} edition as a {Body Type} built to meet modern driving needs. Featuring a {Fuel Type} engine, it offers a balance of style, economy, and functionality. Reviewing specifications provides insights into performance, interior comfort, and overall value.`,
  `As part of its {Year} lineup, {Make} introduces the {Car Name}, model {Model}, a {Body Type} designed with a {Fuel Type} engine for efficiency and strength. This car combines technology with practicality, making it a popular choice among buyers. Specifications highlight essential details that guide purchasing decisions.`,
  `Drivers looking for a dependable {Body Type} can explore the {Car Name} from {Make}, {Model} {Year}. With its {Fuel Type} engine, it promises efficiency and long-term reliability. Full specifications allow buyers to evaluate how the car performs in different conditions, helping them select the right model.`,
  `The {Car Name}, crafted by {Make}, released as the {Model} in {Year}, is a modern {Body Type} with a {Fuel Type} powertrain. Known for its practicality and sleek design, it appeals to a wide range of car buyers. Specifications provide detailed insights into performance, comfort, and fuel efficiency.`,
];

function applyIntroTemplate(template, values) {
  return template
    .replace(/{Car Name}/g, values.carName || "")
    .replace(/{Make}/g, values.make || "")
    .replace(/{Model}/g, values.model || "")
    .replace(/{Year}/g, values.year || "")
    .replace(/{Body Type}/g, values.bodyType || "")
    .replace(/{Fuel Type}/g, values.fuelType || "");
}

export default async function VehicleDetailPage({ params }) {
  const host = (await headers()).get("host") || "informreaders.com";
  const country = getCountryName(getCountryCodeFromHost(host));
  const data = await getVehicleData(params.id);

  // Define sections
  const sections = [
    {
      title: "General Information",
      icon: Car,
      keys: [
        "Body Type",
        "Seats",
        "Doors",
        "Length",
        "Width",
        "Height",
        "Wheelbase",
        "Front Track",
        "Rear Track",
        "Kerb Weight",
        "Max Weight",
        "Max Load",
        "Trunk (Boot) Space - Minimum",
        "Trunk (Boot) Space - Maximum",
        "Fuel Tank Capacity",
      ],
    },
    {
      title: "Engine Specifications",
      icon: Wrench,
      keys: [
        "Powertrain Architecture",
        "Fuel Type",
        "Engine displacement",
        "Power",
        "Power per litre",
        "Torque",
        "Engine layout",
        "Engine Model/Code",
        "Number of cylinders",
        "Engine configuration",
        "Cylinder Bore",
        "Piston Stroke",
        "Number of valves per cylinder",
        "Fuel injection system",
        "Engine aspiration",
        "Engine oil capacity",
        "Coolant",
      ],
    },
    {
      title: "Performance",
      icon: Gauge,
      keys: [
        "Acceleration 0 - 100 km/h",
        "Acceleration 0 - 62 mph",
        "Acceleration 0 - 60 mph (Calculated by Auto-Data.net)",
        "Maximum speed",
        "Weight-to-power ratio",
        "Weight-to-torque ratio",
      ],
    },
    {
      title: "Fuel Economy and Emissions",
      icon: Fuel,
      keys: [
        "Fuel consumption (economy) - urban",
        "Fuel consumption (economy) - extra urban",
        "Fuel consumption (economy) - combined",
        "CO",
        "Emission standard",
      ],
    },
    {
      title: "Drivetrain and Transmission",
      icon: Car,
      keys: [
        "Drivetrain Architecture",
        "Drive wheel",
        "Number of gears and type of gearbox",
        "Minimum turning circle (turning diameter)",
      ],
    },
    {
      title: "Suspension and Brakes",
      icon: Wrench,
      keys: ["Front suspension", "Rear suspension", "Front brakes", "Rear brakes"],
    },
    {
      title: "Steering and Tires",
      icon: Car,
      keys: ["Steering type", "Power steering", "Tires size", "Wheel rims size"],
    },
  ];

  const faqTemplates = [
    {
      q: "What are the key specifications of {Car Name} {Make} {Year} in {country}?",
      a: "In {country}, the {Car Name} {Year} by {Make} comes with a {Body Type}, {Fuel Type} engine, and {Number of Gears}-gear {Type of Gearbox}.",
    },
    {
      q: "Is {Car Name} {Year} {Make} available in {country} with automatic gearbox?",
      a: "Yes, the {Car Name} {Year} is offered in {country} with a {Type of Gearbox}, ensuring smooth driving in urban traffic.",
    },
    {
      q: "What is the most popular body type of {Car Name} {Year} in {country}?",
      a: "The most preferred version in {country} is the {Body Type}, combining comfort with {Fuel Type} efficiency.",
    },
  ];

  function applyFaqTemplate(template, values) {
    return {
      q: template.q
        .replace(/{Car Name}/g, values.carName || "")
        .replace(/{Make}/g, values.make || "")
        .replace(/{Year}/g, values.year || "")
        .replace(/{Body Type}/g, values.bodyType || "")
        .replace(/{Fuel Type}/g, values.fuelType || "")
        .replace(/{Number of Gears}/g, values.numberOfGears || "")
        .replace(/{Type of Gearbox}/g, values.gearboxType || "")
        .replace(/{country}/g, values.country || ""),
      a: template.a
        .replace(/{Car Name}/g, values.carName || "")
        .replace(/{Make}/g, values.make || "")
        .replace(/{Year}/g, values.year || "")
        .replace(/{Body Type}/g, values.bodyType || "")
        .replace(/{Fuel Type}/g, values.fuelType || "")
        .replace(/{Number of Gears}/g, values.numberOfGears || "")
        .replace(/{Type of Gearbox}/g, values.gearboxType || "")
        .replace(/{country}/g, values.country || ""),
    };
  }

  // Spec map banate hain
  const specMap = {};
  if (data?.data) {
    [
      ...(data.data.technicalSpecs || []),
      ...(data.data.featureAndSafety || []),
      ...(data.data.evsFeatures || []),
    ].forEach((spec) => {
      if (spec.name) {
        specMap[spec.name] = spec.value || spec.value === "" ? spec.value : "---";
      }
    });
  }

  const values = {
    carName: data?.data?.name || "",
    make: data?.data?.makeId?.name || "",
    year: data?.data?.year || "",
    bodyType: specMap["Body Type"] || "",
    fuelType: specMap["Fuel Type"] || "",
    numberOfGears: specMap["Number of Gears"] || "",
    gearboxType: specMap["Number of gears and type of gearbox"] || "",
    country,
  };

  const faqs = faqTemplates.map((t) => applyFaqTemplate(t, values));

  const randomIntro = applyIntroTemplate(
    introTemplates[Math.floor(Math.random() * introTemplates.length)],
    values
  );

  const renderSpecSection = (title, Icon, specs) => {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 transition-all hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-gray-700">
            <tbody>
              {specs.map((spec, index) => (
                <tr
                  key={spec.name}
                  className="odd:bg-gray-50 even:bg-white border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{spec.name}</td>
                  <td className="px-4 py-3">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-6 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{data?.data?.name}</h1>
          <ShareButton data={data} />
        </section>
        <p className="mt-3 text-gray-600">{randomIntro}</p>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              {data?.data?.image ? (
                <Image
                  src={data.data.image}
                  alt={data.data.name || ""}
                  width={400}
                  height={300}
                  className="rounded-lg w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg mx-auto" />
              )}
            </div>
          </div>

          {/* Technical Specs & Features */}
          <div className="lg:col-span-2 space-y-6">
            {sections.map((section) => {
              const sectionSpecs = section.keys.map((key) => ({
                name: key,
                value: specMap[key] || "---",
              }));

              return renderSpecSection(section.title, section.icon, sectionSpecs);
            })}
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
          </div>
        </div>

        {/* Related Vehicles Section */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-center mb-8">Related Vehicles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.related?.map((vehicle) => (
              <VehicleCard vehicle={vehicle} key={vehicle?._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
