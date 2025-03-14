'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';

function FlightSearchFilter() {
    const [stops, setStops] = useState([]);
    const [carryOnBag, setCarryOnBag] = useState(0);
    const [checkedBag, setCheckedBag] = useState(0);
    const [takeoffTime, setTakeoffTime] = useState([0, 24]);
    const [flightDuration, setFlightDuration] = useState([1, 5]);
    const [layover, setLayover] = useState([0, 16]);
    const [selectedTab, setSelectedTab] = useState('takeoff');
    const [selectedFlights, setSelectedFlights] = useState([]);
    const [flightTime, setFlightTime] = useState([0, 24]);
    const [layoverTime, setLayoverTime] = useState([0, 0]);
    const [openSections, setOpenSections] = useState({});
    


    const toggleFlightSelection = (flight) => {
        setSelectedFlights((prev) =>
            prev.includes(flight) ? prev.filter((f) => f !== flight) : [...prev, flight]
        );
    };


    const handleStopChange = (value) => {
        setStops((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]));
    };

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };


    return (
        <div className="md:w-80 p-4 bg-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-center bg-white p-2 rounded-md">Filters</h2>
            <div className="mt-4">
                <p className='text-lg mb-2'>1 <span className='text-gray-500'> of 1 Flight </span></p>
                <p className="font-semibold">Stops</p>
                {["Non stop", "1 Stop", "2+ Stop"].map((stop) => (
                    <label key={stop} className="block">
                        <input type="checkbox" checked={stops.includes(stop)} onChange={() => handleStopChange(stop)} /> {stop}
                    </label>
                ))}
            </div>
            <div className="mt-4">
                <p className="font-semibold">Fee Assistant</p>
                <div className="flex justify-between">
                    <span>Carry-on bag</span>
                    <div className='flex items-center gap-2'>
                        <button className='bg-white w-5 h-5 rounded-md border border-black flex items-center justify-center' onClick={() => setCarryOnBag(carryOnBag + 1)}>+</button>
                        <span>{carryOnBag}</span>
                        <button className='bg-white w-5 h-5 rounded-md border border-black flex items-center justify-center' onClick={() => setCarryOnBag(Math.max(0, carryOnBag - 1))}>-</button>
                    </div>

                </div>
                <div className="flex justify-between">
                    <span>Checked bag</span>
                    <div className='flex gap-2 items-center'>
                        <button className='bg-white w-5 h-5 rounded-md border border-black flex items-center justify-center' onClick={() => setCheckedBag(checkedBag + 1)}>+</button>
                        <span>{checkedBag}</span>
                        <button className='bg-white w-5 h-5 rounded-md border border-black flex items-center justify-center' onClick={() => setCheckedBag(Math.max(0, checkedBag - 1))}>-</button>
                    </div>

                </div>
            </div>

            <div className="bg-gray-400 p-4 rounded-lg md:w-72 text-white mt-6">
                {/* Tabs */}
                <div className="flex justify-between bg-white rounded-md p-1 mb-4 gap-2">
                    <button
                        className={`flex-1 text-center p-2 rounded-md ${selectedTab === 'takeoff' ? 'bg-gray-200 text-red-500' : 'text-black'}`}
                        onClick={() => setSelectedTab('takeoff')}
                    >
                        Take-Off
                    </button>
                    <button
                        className={`flex-1 text-center p-2 rounded-md ${selectedTab === 'landing' ? 'bg-gray-200 text-red-500' : 'text-black'}`}
                        onClick={() => setSelectedTab('landing')}
                    >
                        Landing
                    </button>
                </div>

                {/* Flight Selection */}
                <div className=" bg-white p-2 rounded-md">
                    <label className="flex items-center text-black">
                        <input
                            type="checkbox"
                            className="mr-2 text-black"
                            onChange={() => toggleFlightSelection('KHI')}
                        />
                        Take-off from KHI
                    </label>
                    <span className='text-black'> Fri 1:30 PM - 1:35 PM</span>
                </div>
                <input type="range" min="0" max="24" className="w-full mt-2" />

                <div className="mt-5 bg-white p-2 rounded-md">
                    <label className="flex items-center text-black">
                        <input
                            type="checkbox"
                            className="mr-2"
                            onChange={() => toggleFlightSelection('LYP')}
                        />
                        Take-off from LYP
                    </label>
                    <span className='text-black'> Fri 1:30 PM - 1:35 PM</span>
                </div>
                <input type="range" min="0" max="24" className="w-full mt-2" />

                {/* Airlines */}
                <h3 className="font-semibold text-3xl mt-4 mb-3 ">Airlines</h3>
                <div className="flex   text-sm mb-2 gap-3">
                    <label className='text-black'>
                        <input type="checkbox" className="mr-1" /> Select All
                    </label>
                    <label>
                        <input type="checkbox" className="mr-1" /> Clear All
                    </label>
                    {/* <button></button> */}
                </div>
                <div className="bg-white text-black p-2 rounded-md">Pakistan International Airlines <span className="text-red-600">$147</span></div>

                {/* Airports */}
                <h3 className="font-bold mt-4 text-2xl text-black">Airports</h3>
                <div>
                    <p className="font-semibold text-black mb-1">Karachi</p>
                    <div className='flex items-center justify-between bg-white text-black p-2 rounded-md'>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> KHI: Quaid-E-Azam
                        </label>
                        <span className="text-red-600">$147</span>
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-black mb-1">Karachi</p>
                    <div className='flex items-center justify-between bg-white text-black p-2 rounded-md'>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> KHI: Quaid-E-Azam
                        </label>
                        <span className="text-red-600">$147</span>
                    </div>
                </div>

                {/* Duration */}
                <h3 className="font-bold mt-4">Duration:</h3>
                <p>Flight leg</p>
                <input type="range" min="1.75" max="1.75" className="w-full" />
                <p>Layover</p>
                <input type="range" min="0" max="0" className="w-full" />
            </div>


            <div className="mt-4">
                {["Price", "Cabin", "AirCraft", "Booking Sites"].map((section) => (
                    <div key={section} className="border-b border-gray-300 bg-white" >
                        <button onClick={() => toggleSection(section)} className="w-full text-left py-2 px-4 flex justify-between items-center font-semibold">
                            {section}
                            <span>{openSections[section] ? <Icon icon="basil:caret-up-outline" width="24" height="24" /> : <Icon icon="basil:caret-down-outline" width="24" height="24" />}</span>
                        </button>
                        {openSections[section] && <div className="p-2">{section} filter content goes here...</div>}
                    </div>
                ))}
            </div>

        </div>
    );
}

export default FlightSearchFilter;