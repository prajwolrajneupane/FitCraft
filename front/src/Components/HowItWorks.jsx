import React from "react";
// Import icons from a React Icons library (e.g., Font Awesome)
import { FaTshirt, FaPencilRuler, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

// Replace the SVG functions with the imported React Icon components
const icons = {
  apparel: FaTshirt,
  design: FaPencilRuler, // Using FaPencilRuler for a design/tool theme
  order: FaShoppingCart,
};

const HowItWorksStep = ({
  number,
  title,
  description,
  icon: Icon, // Destructuring prop as 'Icon' for JSX rendering
  colorClass,
}) => (
  <div className="flex flex-col items-center text-center p-6">
    {/* The number now has an explicit font size class 'text-7xl' and the colorClass for styling */}
    <div className={`text-7xl font-extrabold mb-4 ${colorClass}`}>{number}</div>
    <div className="mb-4">
      {/* React Icons automatically handle the 'className' for size and color */}
      <Icon className={`w-12 h-12 ${colorClass}`} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="text-teal-500">How</span> It Works
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Unleash your creativity in 3 simple steps.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <HowItWorksStep
            number="1"
            title="Choose Your Item"
            description="Select from our wide range of blank apparel: T-shirts, hoodies, hats, and more. Pick your color and size."
            icon={icons.apparel} // Passing the imported React Icon component
            colorClass="text-teal-500"
          />
          <HowItWorksStep
            number="2"
            title="Design with Our Tools"
            description="Upload your own images, sketch a design, or use our text editor to customize your item perfectly."
            icon={icons.design} // Passing the imported React Icon component
            colorClass="text-purple-300"
          />
          <HowItWorksStep
            number="3"
            title="Place Your Order"
            description="Review your custom design, checkout securely, and sit back while we handle the production and fast delivery!"
            icon={icons.order} // Passing the imported React Icon component
            colorClass="text-teal-500"
          />
        </div>

        <div className="text-center mt-12">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-10 rounded-full text-lg shadow-lg transition duration-300"
            onClick={() => console.log("Navigate to the customizer tool")}>
            <Link to="/wearables">Start Designing Now</Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
