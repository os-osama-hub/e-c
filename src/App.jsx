import { useEffect, useState } from "react";
import "./App.css";
import { AiOutlineCloseCircle } from "react-icons/ai";

function App() {
  const [cart, setCart] = useState(() => {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : {};
  });
  const [data, setData] = useState([]);
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("mode") || "light";
  });
  const [cartPage, setCartPage] = useState(false);
  const [count, setCount] = useState(() => {
    return localStorage.getItem("count")
      ? JSON.parse(localStorage.getItem("count"))
      : {};
  });

  const fetchData = async () => {
    const response = await fetch("https://fakestoreapi.com/products");
    const result = await response.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("count", JSON.stringify(count));
  }, [count]);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const updateCount = (id, increment) => {
    setCount((prev) => ({
      ...prev, // Get previous values and keep them
      [id]: Math.max((prev[id] || 1) + increment, 1), // Prevent negative values   id : count      ex : 1:5  2:7
    }));
  };

  const updateCartQuantity = (itemId, increment) => {
    //شرح
    setCart((prevCart) => {
      if (!prevCart[itemId]) return prevCart;
      const item = prevCart[itemId];
      const newQuantity = Math.max(item.quantity + increment, 1);
      return {
        ...prevCart,
        [itemId]: {
          ...item,
          quantity: newQuantity,
          totalPrice: (item.item.price * newQuantity).toFixed(2),
          osama: "osama",
        },
      };
    });
  };
  console.log(cart);
  const addToCart = (item) => {
    const itemId = item.id;
    const quantity = count[itemId] || 1;

    setCart((prevCart) => {
      // If item already exists in cart, update quantity
      if (prevCart[itemId]) {
        return {
          ...prevCart, //يحفظ القيم السابقه
          [itemId]: {
            ...prevCart[itemId], //ينسخ بيانات العنصر الحالي للحفاظ على خصائصه  مع تحديث بعض القيم لاحقا
            quantity: quantity,
            totalPrice: (item.price * quantity).toFixed(2),
          },
        };
      } else {
        // Add new item to cart
        return {
          ...prevCart,
          [itemId]: {
            item: item,
            quantity: quantity,
            totalPrice: (item.price * quantity).toFixed(2),
          },
        };
      }
    });

    // Reset the count for this item back to 1 after adding to cart
    setCount((prev) => ({
      ...prev,
      [itemId]: 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[itemId];
      return newCart;
    });
  };

  // Calculate total items in cart
  const cartItemCount = Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate total price of all items in cart
  const cartTotal = Object.values(cart)
    .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
    .toFixed(2);
  console.log(cartTotal);
  console.log(cartItemCount);

  return (
    <>
      <div
        className={`fixed w-full h-14 py-3 flex justify-end ${
          mode === "light" ? "bg-gray-50" : "bg-gray-900"
        }`}
      >
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className="mr-6 px-3 py-0 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        >
          {mode === "light" ? "Dark Mode" : "Light Mode"}
        </button>
        <button
          onClick={() => setCartPage(!cartPage)}
          className="mr-6 px-3 py-0 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        >
          Cart {cartItemCount > 0 && `(${cartItemCount})`}
        </button>
      </div>

      {cartPage && (
        <div
          className={`fixed top-0 right-0 w-[30%] h-full overflow-y-auto shadow-lg z-50 ${
            mode === "light"
              ? "bg-gray-50 text-gray-700"
              : "bg-gray-700 text-gray-100"
          }`}
        >
          <div className="p-4">
            <div className="flex flex-row justify-between">
              <p className="text-2xl font-bold mt-2">Your Cart</p>
              <button
                onClick={() => setCartPage(false)}
                className={`mt-3 px-3 py-1 text-2xl ${
                  mode === "light"
                    ? " hover:bg-gray-200 "
                    : " hover:bg-gray-600 "
                }rounded-[5px] `}
              >
                <AiOutlineCloseCircle />
              </button>
            </div>

            {Object.keys(cart).length === 0 ? (
              <p className="mt-4">Your cart is empty</p>
            ) : (
              <div className="mt-4 space-y-4">
                {Object.entries(cart).map(
                  //ال اينترايز بحول كل كائن داخل الكارت الى مصفوفة
                  (
                    [id, cartItem] //والمااب بلف عليهن للمصفوفات وبعطي كل وحدده اي دي قيمتو تساوي ال اي دي تبع الكارت والكارت ايتم بتوخذ قيم الكارت
                  ) => (
                    <div
                      key={id}
                      className={`p-4 rounded-lg ${
                        mode === "light" ? "bg-gray-100" : "bg-gray-800"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <img
                            src={cartItem.item.image}
                            alt={cartItem.item.title}
                            className="w-16 h-16 object-contain"
                          />
                          <div>
                            <h3 className="font-medium">
                              {cartItem.item.title}
                            </h3>
                            <div className="flex items-center mt-2 mb-2">
                              <div
                                className={`${
                                  mode === "light"
                                    ? "bg-gray-200 border-gray-300"
                                    : "bg-gray-700 border-gray-600"
                                } border rounded-lg flex items-center`}
                              >
                                <button
                                  onClick={() => updateCartQuantity(id, -1)}
                                  className="px-2 py-1 text-sm"
                                >
                                  ➖
                                </button>
                                <span className="px-2">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(id, 1)}
                                  className="px-2 py-1 text-sm"
                                >
                                  ➕
                                </button>
                              </div>
                            </div>
                            <p>${cartItem.totalPrice}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                )}
                <div className="pt-4 border-t">
                  <p className="text-xl font-bold">Total: ${cartTotal}</p>
                  <button
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                      alert("Checkout functionality would go here!")
                    }
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className={`${cartPage ? "blur-sm" : ""} transition-all duration-300`}
      >
        <div
          className={`text-center pt-14 ${
            mode === "light"
              ? "text-gray-700 bg-gray-50"
              : "text-gray-100 bg-gray-900"
          }`}
        >
          <h1 className="text-3xl font-bold">E-Commerce</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="border-gray-700 rounded-2xl border-4 m-4 p-4"
              >
                <div className="space-y-4 flex flex-col items-center">
                  <p
                    className={`${
                      mode === "light" ? "bg-gray-100" : "bg-gray-600"
                    } px-3 py-1 rounded-full`}
                  >
                    {item.category}
                  </p>
                  <h2 className="font-medium text-lg h-16">{item.title}</h2>
                  <div className="h-48 flex items-center justify-center">
                    <img
                      className="max-h-full max-w-full object-contain"
                      src={item.image}
                      alt={item.title}
                    />
                  </div>
                  <p>
                    Price for {count[item.id] || 1} pc: $
                    {((count[item.id] || 1) * item.price).toFixed(2)}
                  </p>
                  <div
                    className={`${
                      mode === "light"
                        ? "bg-gray-100 border-gray-200"
                        : "bg-gray-700"
                    } border-2 rounded-2xl`}
                  >
                    <div className="mx-2 space-x-6 py-1">
                      <button onClick={() => updateCount(item.id, -1)}>
                        ➖
                      </button>
                      <span>{count[item.id] || 1}</span>
                      <button onClick={() => updateCount(item.id, 1)}>
                        ➕
                      </button>
                    </div>
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full py-2 px-4 rounded"
                    onClick={() => addToCart(item)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            className={` font-semibold  p-2 border-2 rounded-2xl border-gray-200 ${
              mode === "light" ? "bg-gray-200" : "bg-gray-800"
            }`}
          >
            {" "}
            To contact : @gmail.com
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
