import Layout from "../shared/Layout";


const About = () => {
  return (
    <Layout>
        <div className="flex flex-col min-h-screen">
      {/* === HERO SECTION === */}
      <section className="bg-primary text-white py-24 text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl mx-auto text-gray-100 text-sm sm:text-base">
          We’re passionate about creativity, comfort, and self-expression.
          Every product we design tells a story — one that connects people
          through fashion and innovation.
        </p>
      </section>

      {/* === COMPANY STORY === */}
      <section className="bg-white py-20 px-6 md:px-16 lg:px-24 text-gray-800">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
          <p className="text-gray-600 leading-7 mb-4">
            Founded in 2024, <span className="font-semibold">Desober</span> was
            built from a love for fashion that empowers individuals. We blend
            modern design with timeless quality, creating styles that help you
            express your identity confidently.
          </p>
          <p className="text-gray-600 leading-7">
            What started as a small creative idea has grown into a brand that
            celebrates individuality, community, and sustainability. We believe
            that what you wear should reflect who you are — bold, original, and
            authentic.
          </p>
        </div>
      </section>

      {/* === MISSION / VALUES === */}
      <section className="bg-gray-50 py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-10">
            Our Mission & Values
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Innovation
              </h3>
              <p className="text-gray-600 text-sm">
                We’re always exploring new trends, materials, and ideas to bring
                our customers something fresh and inspiring.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Sustainability
              </h3>
              <p className="text-gray-600 text-sm">
                We’re committed to responsible production and eco-friendly
                design choices that respect both people and the planet.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Community
              </h3>
              <p className="text-gray-600 text-sm">
                Fashion is more than clothing — it’s connection. We create with
                the people who inspire us every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="bg-primary text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Join the Desober Family</h2>
        <p className="max-w-xl mx-auto text-gray-100 mb-8 text-sm sm:text-base">
          Explore our latest collections, discover your style, and be part of a
          creative movement that celebrates individuality.
        </p>
        <button className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:scale-105 transition">
          Explore Now
        </button>
      </section>

    </div>
    </Layout>
  );
};

export default About;