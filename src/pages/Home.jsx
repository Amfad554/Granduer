import LinesEllipsis from "react-lines-ellipsis";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import "react-toastify/dist/ReactToastify.css";
import { Link, NavLink } from "react-router-dom";
import { FaArrowCircleRight, FaArrowRight, FaHeart,  FaShoppingCart } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../shared/Layout";

const Home = () => {
  const { HandleGetProducts, productData } = useContext(ProductContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [few, setFew] = useState([]);
  const [fewDisplay, setFewDisplay] = useState(true);

  useEffect(() => {
    HandleGetProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (productData && productData.length > 0) {
      const less = productData.slice(0, 3);
      setFew(less);

      const found = productData.filter((item) => item.bestSeller === true);

      // ✅ Fallback to all products if no best sellers found
      setBestSeller(found.length > 0 ? found : productData);
    }
  }, [productData]);

  return (
    <Layout>
      <div className="bg-primary flex flex-col justify-center min-h-screen mb-12">
        <div className="flex justify-center">
          <NavLink className="relative rounded-3xl text-sm overflow-hidden p-4 mt-4">
            <div className="absolute w-full h-full top-0 left-0 rounded-3xl bg-gradient-to-l from-black to-transparent z-20"></div>
            <div className="p-2 border-t-[1px] border-b-[1px] border-l-[1px] text-white rounded-3xl">
              <p className="relative z-30">New collection 2025</p>
            </div>
          </NavLink>
        </div>

        {/* Hero text */}
        <div className="flex items-center justify-center">
          <p className="lg:text-5xl md:text-2xl text-xl font-bold text-white text-center lg:px-[10rem] md:px-[5rem] px-[2rem]">
            Where style meets expression, trends inspire, and fashion thrives.
          </p>
        </div>

        <div className="flex items-center justify-center text-white mt-7 text-center lg:px-[10rem] md:px-[5rem] px-[2rem]">
          <p>
            Step into a fashion haven where the latest trends meet your unique
            style aspirations. Redefine your wardrobe with Desober today!
          </p>
        </div>

        {/* Button */}
        <div className="flex items-center justify-center mt-8">
          <div className="rounded-3xl bg-white p-2 text-primary w-40 flex items-center justify-center gap-2">
            <Link>New collection</Link>
            <FaArrowCircleRight className="font-bold text-xl" />
          </div>
        </div>

        {/* Product Slider */}
        <div className="w-full md:px-4 px-28 pb-16 flex flex-col justify-center items-center">
          <Swiper
            autoplay={{ delay: 1000, disableOnInteraction: false }}
            spaceBetween={20}
            loop={true}
            speed={1000}
            slidesPerGroup={1}
            modules={[Autoplay]}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full h-72 lg:h-72 xl:h-96 flex flex-col justify-center items-center"
          >
            {productData &&
              productData.map((product) => (
                <SwiperSlide
                  key={product.id}
                  className="flex justify-center items-center md:w-full w-1/2 mt-10 rounded-t-[50%] overflow-hidden"
                >
                  <Link to={`/product/${product.id}`} className="w-full h-full">
                    <img
                      src={product.image}
                      alt="Fashion"
                      className="object-cover w-full h-full"
                    />
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        {/* Best Seller Section */}
        <div className="bg-white lg:pt-12 pt-2">
          <p className="text-center text-primary text-2xl font-semibold w-full mt-8">
            Best Seller
          </p>
          <p className="text-center text-primary w-full mt-2 text-lg">
            Stay cozy and stylish with our exclusive collection of best-selling
            Hoodies
          </p>

          <div className="px-4 md:px-10 lg:px-20 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-16 gap-16 justify-center items-stretch lg:mt-6 mt-8">
            {fewDisplay ? (
              <>
                {few &&
                  few.map((few) => (
                    <div
                      key={few.id}
                      className="hover:shadow-2xl transition ease-in-out duration-500 rounded-md overflow-hidden"
                    >
                      <div className="w-full h-[26rem] overflow-hidden">
                        <Link to={`/product/${few.id}`} className="w-full h-full">
                          <img
                            src={few.image}
                            alt="Fashion"
                            className="object-cover w-full h-full"
                          />
                        </Link>
                      </div>
                      <div className="p-2">
                        <p className="text-black font-bold mt-2">{few.name}</p>
                        <p className="text-black mt-2 z-50">{few.description}</p>

                        <div className="flex justify-between items-center mt-2">
                          <span className="p-2 bg-primary text-white rounded-md">
                            ${few.price}
                          </span>

                          <div className="flex justify-between items-center gap-4">
                            <span className="rounded-full p-2 bg-white border-[1px] border-primary flex justify-center items-center">
                              <FaHeart className="h-6 w-6" />
                            </span>
                            <span className="rounded-full p-2 text-white bg-primary flex justify-center items-center">
                              <FaShoppingCart className="h-6 w-6" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <>
                {bestSeller &&
                  bestSeller.map((best) => (
                    <div
                      key={best.id}
                      className="hover:shadow-2xl transition ease-in-out duration-500 rounded-md overflow-hidden"
                    >
                      <div className="w-full h-[26rem] overflow-hidden">
                        <Link to={`/product/${best.id}`} className="w-full h-full">
                          <img
                            src={best.image}
                            alt="Fashion"
                            className="object-cover w-full h-full"
                          />
                        </Link>
                      </div>
                      <div className="p-2">
                        <p className="text-black font-bold mt-2">{best.name}</p>
                        <p className="text-black mt-2 z-50">
                          {best.description}
                        </p>

                        <div className="flex justify-between items-center mt-2">
                          <span className="p-2 bg-primary text-white rounded-md">
                            ${best.price}
                          </span>

                          <div className="flex justify-between items-center gap-4">
                            <span className="rounded-full p-2 bg-white border-[1px] border-primary flex justify-center items-center">
                              <FaHeart  className="h-6 w-6" />
                            </span>
                            <span className="rounded-full p-2 text-white bg-primary flex justify-center items-center">
                              <FaShoppingCart className="h-6 w-6" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>

          <div className="flex justify-center mt-8">
            {fewDisplay ? (
              <span
                onClick={() => setFewDisplay(false)}
                className="rounded-md bg-white text-black border-2 border-primary cursor-pointer p-2 flex justify-between items-center gap-2"
              >
                See More
                <p><FaArrowRight /></p>
              </span>
            ) : (
              <span
                onClick={() => setFewDisplay(true)}
                className="rounded-md bg-white text-black border-2 border-primary cursor-pointer p-2 flex justify-between items-center gap-2"
              >
                See Less
                <p><FaArrowRight /></p>
              </span>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
