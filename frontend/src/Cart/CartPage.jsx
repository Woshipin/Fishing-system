// import React, { useState, useEffect } from "react";
// import {
//   ShoppingCart,
//   Package,
//   Clock,
//   Trash2,
//   Plus,
//   Minus,
//   Check,
//   Tag,
//   AlertCircle,
//   Loader,
//   ArrowRight,
//   ArrowLeft,
//   Eye,
//   RefreshCw,
// } from "lucide-react";

// const CartPage = () => {
//   const [productCart, setProductCart] = useState([]);
//   const [packageCart, setPackageCart] = useState([]);
//   const [durations, setDurations] = useState([]);
//   const [tableNumbers, setTableNumbers] = useState([]);
//   const [selectedDuration, setSelectedDuration] = useState(null);
//   const [selectedTableNumber, setSelectedTableNumber] = useState(null);
//   const [promoCode, setPromoCode] = useState("");
//   const [promoApplied, setPromoApplied] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [updating, setUpdating] = useState({});
//   const [currentStep, setCurrentStep] = useState(1);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId");
//     setUserId(storedUserId);
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       fetchCartItems(userId);
//       fetchDurations();
//       fetchTableNumbers();
//     }
//   }, [userId]);

//   const getHeaders = () => ({
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   });

//   const fetchCartItems = async (userId) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         `http://127.0.0.1:8000/api/cart/items?user_id=${userId}`,
//         {
//           method: "GET",
//           headers: getHeaders(),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch cart items");
//       }

//       const data = await response.json();
//       setProductCart(data.productCart || []);
//       setPackageCart(data.packageCart || []);
//     } catch (err) {
//       console.error("Fetch cart items error:", err);
//       setError("Failed to fetch cart items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDurations = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/durations", {
//         method: "GET",
//         headers: getHeaders(),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch durations");
//       }

//       const data = await response.json();
//       setDurations(data);
//     } catch (err) {
//       console.error("Error fetching durations:", err);
//     }
//   };

//   const fetchTableNumbers = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/table-numbers", {
//         method: "GET",
//         headers: getHeaders(),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch table numbers");
//       }

//       const data = await response.json();
//       setTableNumbers(data);
//     } catch (err) {
//       console.error("Error fetching table numbers:", err);
//     }
//   };

//   const refreshCart = async () => {
//     if (userId) {
//       await fetchCartItems(userId);
//     }
//   };

//   const steps = [
//     {
//       number: 1,
//       title: "Cart Items",
//       icon: ShoppingCart,
//       description: "Review your products and packages",
//     },
//     {
//       number: 2,
//       title: "Duration",
//       icon: Clock,
//       description: "Choose subscription length",
//     },
//     {
//       number: 3,
//       title: "Table Number",
//       icon: Tag,
//       description: "Select table number",
//     },
//     {
//       number: 4,
//       title: "Review",
//       icon: Eye,
//       description: "Confirm your order",
//     },
//   ];

//   const isStepValid = (step) => {
//     switch (step) {
//       case 1:
//         return productCart.length > 0 || packageCart.length > 0;
//       case 2:
//         return selectedDuration !== null;
//       case 3:
//         return selectedTableNumber !== null;
//       case 4:
//         return true;
//       default:
//         return false;
//     }
//   };

//   const canProceedToStep = (step) => {
//     for (let i = 1; i < step; i++) {
//       if (!isStepValid(i)) return false;
//     }
//     return true;
//   };

//   const updateQuantity = (type, id, newQuantity) => {
//     if (newQuantity < 1) return;

//     if (type === "product") {
//       setProductCart((prev) =>
//         prev.map((item) =>
//           item.id === id ? { ...item, quantity: newQuantity } : item
//         )
//       );
//     } else {
//       setPackageCart((prev) =>
//         prev.map((item) =>
//           item.id === id ? { ...item, quantity: newQuantity } : item
//         )
//       );
//     }
//   };

//   const removeItem = async (type, id) => {
//     setUpdating((prev) => ({ ...prev, [`${type}-${id}`]: true }));

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/cart/${id}`, {
//         method: "DELETE",
//         headers: getHeaders(),
//         body: JSON.stringify({ user_id: userId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to remove item from cart");
//       }

//       if (type === "product") {
//         setProductCart((prev) => prev.filter((item) => item.id !== id));
//       } else {
//         setPackageCart((prev) => prev.filter((item) => item.id !== id));
//       }
//     } catch (error) {
//       console.error("Error removing item:", error);
//       setError(error.message || "Failed to remove item from cart");
//     } finally {
//       setUpdating((prev) => ({ ...prev, [`${type}-${id}`]: false }));
//     }
//   };

//   const applyPromo = () => {
//     if (promoCode.toLowerCase() === "save20") {
//       setPromoApplied(true);
//       setDiscount(20);
//     } else {
//       setPromoApplied(false);
//       setDiscount(0);
//     }
//   };

//   const productTotal = productCart.reduce(
//     (sum, item) => sum + (item.price || 0) * item.quantity,
//     0
//   );
//   const packageTotal = packageCart.reduce(
//     (sum, item) => sum + (item.price || 0) * item.quantity,
//     0
//   );
//   const durationPrice = durations.find((d) => d.id === selectedDuration)?.price || 0;
//   const subtotal = productTotal + packageTotal + durationPrice;
//   const discountAmount = subtotal * (discount / 100);
//   const total = subtotal - discountAmount;

//   const getLineStatus = (stepIndex) => {
//     if (stepIndex >= steps.length - 1) return "inactive";
//     const stepNumber = stepIndex + 1;
//     if (currentStep > stepNumber) return "completed";
//     if (currentStep === stepNumber) return "active";
//     return "inactive";
//   };

//   const ProgressStep = ({ step, isActive, isCompleted, isClickable, index }) => (
//     <div className="relative flex-1 flex flex-col items-center">
//       <div
//         className={`flex flex-col items-center cursor-pointer transition-all duration-300 z-10 ${
//           isClickable ? "hover:scale-105" : "cursor-not-allowed opacity-50"
//         }`}
//         onClick={() => isClickable && setCurrentStep(step.number)}
//       >
//         <div
//           className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${
//             isCompleted
//               ? "bg-gradient-to-r from-green-400 to-green-500 border-green-400 shadow-lg shadow-green-200"
//               : isActive
//               ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400 shadow-lg shadow-blue-200"
//               : "bg-white border-gray-300 shadow-md"
//           }`}
//         >
//           {isCompleted ? (
//             <Check className="w-6 h-6 text-white" />
//           ) : (
//             <step.icon
//               className={`w-5 h-5 md:w-6 md:h-6 ${
//                 isActive ? "text-white" : "text-gray-400"
//               }`}
//             />
//           )}
//           {isActive && (
//             <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-pulse"></div>
//           )}
//         </div>
//         <div className="text-center">
//           <div
//             className={`font-semibold text-xs md:text-sm ${
//               isActive
//                 ? "text-blue-600"
//                 : isCompleted
//                 ? "text-green-600"
//                 : "text-gray-400"
//             }`}
//           >
//             {step.title}
//           </div>
//           <div className="text-xs text-gray-500 mt-1 hidden md:block max-w-24">
//             {step.description}
//           </div>
//         </div>
//       </div>
//       {index < steps.length - 1 && (
//         <div className="absolute top-6 md:top-8 left-1/2 w-full h-1 flex items-center z-0">
//           <div className="w-full relative">
//             <div className="w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
//             <div
//               className={`absolute top-0 h-0.5 rounded-full transition-all duration-700 ease-in-out ${
//                 getLineStatus(index) === "completed"
//                   ? "w-full bg-gradient-to-r from-green-400 to-green-500 shadow-sm shadow-green-200"
//                   : getLineStatus(index) === "active"
//                   ? "w-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm shadow-blue-200"
//                   : "w-0 bg-gray-300"
//               }`}
//             >
//               {getLineStatus(index) === "active" && (
//                 <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
//                   <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-pulse border-2 border-blue-400"></div>
//                 </div>
//               )}
//             </div>
//             {getLineStatus(index) === "completed" && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-1 h-1 bg-green-300 rounded-full opacity-60"></div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const CartItem = ({ item, type, showFeatures = false }) => {
//     const isUpdating = updating[`${type}-${item.id}`];

//     return (
//       <div className="p-4 md:p-6 hover:bg-blue-50/30 transition-all duration-300 border-b border-blue-100/50 last:border-b-0 relative rounded-lg">
//         {isUpdating && (
//           <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
//             <Loader className="w-6 h-6 animate-spin text-blue-500" />
//           </div>
//         )}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//           {item.image && (
//             <div className="relative group">
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border border-blue-200/50 shadow-md group-hover:scale-105 transition-transform duration-300"
//                 onError={(e) => {
//                   e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
//                 }}
//               />
//               <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
//             </div>
//           )}
//           <div className="flex-grow space-y-2">
//             <h3 className="font-semibold text-base md:text-lg text-gray-800">
//               {item.name}
//             </h3>
//             <p className="text-blue-600 font-bold text-lg">
//               ${(item.price || 0).toFixed(2)}
//             </p>
//             {showFeatures && item.features && item.features.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {item.features.map((feature, idx) => (
//                   <span key={idx} className="px-2 py-1 bg-blue-100/70 text-blue-700 text-xs rounded-full border border-blue-200/50">
//                     {feature}
//                   </span>
//                 ))}
//               </div>
//             )}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => updateQuantity(type, item.id, item.quantity - 1)}
//                 disabled={item.quantity <= 1}
//                 className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Minus className="w-3 h-3 md:w-4 md:h-4" />
//               </button>
//               <span className="w-10 md:w-12 text-center font-semibold bg-white/70 py-2 rounded-lg border border-blue-200/50 text-sm md:text-base">
//                 {item.quantity}
//               </span>
//               <button
//                 onClick={() => updateQuantity(type, item.id, item.quantity + 1)}
//                 className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Plus className="w-3 h-3 md:w-4 md:h-4" />
//               </button>
//             </div>
//           </div>
//           <div className="flex flex-col items-end gap-3">
//             <span className="text-lg md:text-xl font-bold text-gray-800">
//               ${((item.price || 0) * item.quantity).toFixed(2)}
//             </span>
//             <button
//               onClick={() => removeItem(type, item.id)}
//               disabled={isUpdating}
//               className="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Trash2 className="w-4 h-4" />
//               <span className="text-sm">Remove</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const StepContent = () => {
//     const contentClass = "bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-[0_8px_32px_rgba(59,130,246,0.12)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.18)] transition-all duration-300";

//     const sectionHeaderClass = "bg-gradient-to-r from-blue-100 to-indigo-100 p-4 border-b border-blue-200/30 rounded-t-2xl";

//     const sectionBodyClass = "bg-white/90 backdrop-blur-sm rounded-b-2xl border border-t-0 border-blue-300/50 shadow-inner";

//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">Your Cart Items</h2>
//                 {userId && <p className="text-sm text-gray-500">User ID: {userId}</p>}
//               </div>
//               <button
//                 onClick={refreshCart}
//                 disabled={loading}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-200 disabled:opacity-50"
//               >
//                 <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//                 <span className="text-sm">Refresh</span>
//               </button>
//             </div>

//             <div className={contentClass}>
//               <div className={sectionHeaderClass}>
//                 <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-3">
//                   <div className="p-2 bg-blue-500/10 rounded-lg">
//                     <ShoppingCart className="w-5 h-5 text-blue-600" />
//                   </div>
//                   Products ({productCart.length})
//                 </h2>
//               </div>
//               <div className={sectionBodyClass}>
//                 {productCart.length === 0 ? (
//                   <div className="p-8 text-center text-gray-500">
//                     <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-blue-300" />
//                     <p>No products in cart</p>
//                   </div>
//                 ) : (
//                   productCart.map((item) => <CartItem key={item.id} item={item} type="product" />)
//                 )}
//               </div>
//             </div>

//             <div className={contentClass}>
//               <div className={sectionHeaderClass}>
//                 <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-3">
//                   <div className="p-2 bg-blue-500/10 rounded-lg">
//                     <Package className="w-5 h-5 text-blue-600" />
//                   </div>
//                   Packages ({packageCart.length})
//                 </h2>
//               </div>
//               <div className={sectionBodyClass}>
//                 {packageCart.length === 0 ? (
//                   <div className="p-8 text-center text-gray-500">
//                     <Package className="w-12 h-12 mx-auto mb-4 text-blue-300" />
//                     <p>No packages selected</p>
//                   </div>
//                 ) : (
//                   packageCart.map((item) => <CartItem key={item.id} item={item} type="package" showFeatures />)
//                 )}
//               </div>
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className={contentClass}>
//             <div className={sectionHeaderClass}>
//               <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-3">
//                 <div className="p-2 bg-blue-500/10 rounded-lg">
//                   <Clock className="w-5 h-5 text-blue-600" />
//                 </div>
//                 Subscription Duration
//               </h2>
//             </div>
//             <div className={sectionBodyClass}>
//               {loading ? (
//                 <div className="flex items-center justify-center p-8">
//                   <Loader className="w-8 h-8 animate-spin text-blue-500" />
//                   <span className="ml-3 text-gray-600">Loading durations...</span>
//                 </div>
//               ) : (
//                 <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 p-4">
//                   {durations.map((duration) => (
//                     <div
//                       key={duration.id}
//                       onClick={() => setSelectedDuration(duration.id)}
//                       className={`p-4 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
//                         selectedDuration === duration.id
//                           ? "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-400 shadow-lg shadow-blue-200/50"
//                           : "bg-white/70 border-blue-200/50 hover:bg-blue-50/50 shadow-md hover:shadow-lg"
//                       }`}
//                     >
//                       <div className="text-center space-y-3">
//                         <div className="flex items-center justify-center gap-2">
//                           <div
//                             className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                               selectedDuration === duration.id
//                                 ? "bg-blue-500 border-blue-500"
//                                 : "border-gray-300"
//                             }`}
//                           >
//                             {selectedDuration === duration.id && <Check className="w-3 h-3 text-white" />}
//                           </div>
//                           <span className="font-bold text-lg text-gray-800">{duration.name}</span>
//                           {duration.popular && (
//                             <span className="px-2 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs rounded-full">
//                               Popular
//                             </span>
//                           )}
//                         </div>
//                         <div className="text-3xl font-bold text-blue-600">${(duration.price || 0).toFixed(2)}</div>
//                         {duration.value && <div className="text-sm text-gray-600">{duration.value}</div>}
//                         {duration.discount && (
//                           <div className="text-sm text-green-600 font-medium bg-green-50 py-1 px-3 rounded-full">
//                             {duration.discount}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className={contentClass}>
//             <div className={sectionHeaderClass}>
//               <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-3">
//                 <div className="p-2 bg-blue-500/10 rounded-lg">
//                   <Tag className="w-5 h-5 text-blue-600" />
//                 </div>
//                 Select Table Number
//               </h2>
//             </div>
//             <div className={sectionBodyClass}>
//               {loading ? (
//                 <div className="flex items-center justify-center p-8">
//                   <Loader className="w-8 h-8 animate-spin text-blue-500" />
//                   <span className="ml-3 text-gray-600">Loading table numbers...</span>
//                 </div>
//               ) : (
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
//                   {tableNumbers.map((tableNumber) => (
//                     <div
//                       key={tableNumber.id}
//                       onClick={() => setSelectedTableNumber(tableNumber.id)}
//                       className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
//                         selectedTableNumber === tableNumber.id
//                           ? "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-400 shadow-lg shadow-blue-200/50"
//                           : "bg-white/70 border-blue-200/50 hover:bg-blue-50/50 shadow-md hover:shadow-lg"
//                       }`}
//                     >
//                       <div className="text-center space-y-2">
//                         <span className="font-bold text-lg text-gray-800">Table {tableNumber.number}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <div className="bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg">
//               <div className="bg-gradient-to-r from-blue-100/80 to-indigo-100/80 backdrop-blur-sm p-4 border-b border-blue-200/30 rounded-t-2xl">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
//                   <Eye className="w-6 h-6 text-blue-600" />
//                   Order Review
//                 </h2>
//               </div>

//               <div className="p-4 md:p-6 space-y-6">
//                 <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-300/50 p-4 shadow-inner">
//                   <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Products</h3>
//                   {productCart.length === 0 ? (
//                     <p className="text-gray-500 text-center py-4">No products in cart</p>
//                   ) : (
//                     productCart.map((item) => (
//                       <div key={item.id} className="flex justify-between items-center py-3 border-b border-blue-100 last:border-0">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={item.image}
//                             alt={item.name}
//                             className="w-12 h-12 rounded-lg object-cover"
//                             onError={(e) => {
//                               e.target.src = "https://via.placeholder.com/48?text=No+Image";
//                             }}
//                           />
//                           <div>
//                             <div className="font-medium text-gray-800">{item.name}</div>
//                             <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
//                           </div>
//                         </div>
//                         <div className="font-semibold text-gray-800">
//                           ${((item.price || 0) * item.quantity).toFixed(2)}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-300/50 p-4 shadow-inner">
//                   <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Packages</h3>
//                   {packageCart.length === 0 ? (
//                     <p className="text-gray-500 text-center py-4">No packages selected</p>
//                   ) : (
//                     packageCart.map((item) => (
//                       <div key={item.id} className="flex justify-between items-center py-3 border-b border-blue-100 last:border-0">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={item.image}
//                             alt={item.name}
//                             className="w-12 h-12 rounded-lg object-cover"
//                             onError={(e) => {
//                               e.target.src = "https://via.placeholder.com/48?text=No+Image";
//                             }}
//                           />
//                           <div>
//                             <div className="font-medium text-gray-800">{item.name}</div>
//                             <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
//                           </div>
//                         </div>
//                         <div className="font-semibold text-gray-800">
//                           ${((item.price || 0) * item.quantity).toFixed(2)}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {selectedDuration && (
//                   <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-300/50 p-4 shadow-inner">
//                     <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Subscription</h3>
//                     <div className="flex justify-between items-center py-3">
//                       <div>
//                         <div className="font-medium text-gray-800">
//                           {durations.find((d) => d.id === selectedDuration)?.name}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {durations.find((d) => d.id === selectedDuration)?.value}
//                         </div>
//                       </div>
//                       <div className="font-semibold text-gray-800">
//                         ${(durations.find((d) => d.id === selectedDuration)?.price || 0).toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {selectedTableNumber && (
//                   <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-300/50 p-4 shadow-inner">
//                     <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Table Number</h3>
//                     <div className="flex justify-between items-center py-3">
//                       <div className="font-medium text-gray-800">
//                         Table {tableNumbers.find((t) => t.id === selectedTableNumber)?.number}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-300/50 p-4 shadow-inner">
//                   <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Order Summary</h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between text-gray-600">
//                       <span>Subtotal</span>
//                       <span>${subtotal.toFixed(2)}</span>
//                     </div>
//                     {promoApplied && (
//                       <div className="flex justify-between text-green-600 font-medium">
//                         <span>Discount ({discount}%)</span>
//                         <span>-${discountAmount.toFixed(2)}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-blue-200">
//                       <span>Total</span>
//                       <span className="text-blue-600">${total.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   if (loading && currentStep <= 1) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading your cart...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!userId) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">User ID Required</h2>
//           <p className="text-gray-600 mb-4">Please log in to view your cart.</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             Refresh Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30">
//       <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
//         <div className="text-center mb-8 md:mb-12">
//           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//             Shopping Cart
//           </h1>
//           <p className="text-gray-600 text-base md:text-lg">Complete your purchase in easy steps</p>
//         </div>

//         <div className="mb-8 md:mb-12">
//           <div className="flex justify-between items-start max-w-4xl mx-auto relative">
//             {steps.map((step, index) => (
//               <ProgressStep
//                 key={step.number}
//                 step={step}
//                 isActive={currentStep === step.number}
//                 isCompleted={currentStep > step.number}
//                 isClickable={canProceedToStep(step.number)}
//                 index={index}
//               />
//             ))}
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50/80 border border-red-200/50 rounded-xl text-red-700 flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 flex-shrink-0" />
//             <span className="flex-grow">{error}</span>
//             <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 flex-shrink-0">
//               <Minus className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         <div className="mb-8">
//           <StepContent />
//         </div>

//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-4 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm p-4 rounded-2xl border border-blue-300/50 shadow-lg">
//           <button
//             onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
//             disabled={currentStep === 1}
//             className="w-full sm:w-auto order-2 sm:order-1 flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Previous
//           </button>

//           <div className="flex items-center gap-4 order-1 sm:order-2">
//             <span className="text-sm text-gray-600">Step {currentStep} of {steps.length}</span>
//             {currentStep === 4 && (
//               <div className="text-right">
//                 <div className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</div>
//                 <div className="text-xs text-gray-500">Total Amount</div>
//               </div>
//             )}
//           </div>

//           {currentStep < 4 ? (
//             <button
//               onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
//               disabled={!isStepValid(currentStep)}
//               className="w-full sm:w-auto order-3 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           ) : (
//             <button
//               disabled={productCart.length === 0 && packageCart.length === 0}
//               className="w-full sm:w-auto order-3 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               Complete Purchase
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  Clock,
  Trash2,
  Plus,
  Minus,
  Check,
  Tag,
  AlertCircle,
  Loader,
  ArrowRight,
  ArrowLeft,
  Eye,
  RefreshCw,
} from "lucide-react";

const CartPage = () => {
  const [productCart, setProductCart] = useState([]);
  const [packageCart, setPackageCart] = useState([]);
  const [durations, setDurations] = useState([]);
  const [tableNumbers, setTableNumbers] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedTableNumber, setSelectedTableNumber] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartItems(userId);
      fetchDurations();
      fetchTableNumbers();
    }
  }, [userId]);

  const getHeaders = () => ({
    Accept: "application/json",
    "Content-Type": "application/json",
  });

  const fetchCartItems = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://127.0.0.1:8000/api/cart/items?user_id=${userId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data = await response.json();
      setProductCart(data.productCart || []);
      setPackageCart(data.packageCart || []);
    } catch (err) {
      console.error("Fetch cart items error:", err);
      setError("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  const fetchDurations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/durations", {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch durations");
      }

      const data = await response.json();
      setDurations(data);
    } catch (err) {
      console.error("Error fetching durations:", err);
    }
  };

  const fetchTableNumbers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/table-numbers", {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch table numbers");
      }

      const data = await response.json();
      setTableNumbers(data);
    } catch (err) {
      console.error("Error fetching table numbers:", err);
    }
  };

  const refreshCart = async () => {
    if (userId) {
      await fetchCartItems(userId);
    }
  };

  const steps = [
    {
      number: 1,
      title: "Cart Items",
      icon: ShoppingCart,
      description: "Review your products and packages",
    },
    {
      number: 2,
      title: "Duration",
      icon: Clock,
      description: "Choose subscription length",
    },
    {
      number: 3,
      title: "Table Number",
      icon: Tag,
      description: "Select table number",
    },
    {
      number: 4,
      title: "Review",
      icon: Eye,
      description: "Confirm your order",
    },
  ];

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return productCart.length > 0 || packageCart.length > 0;
      case 2:
        return selectedDuration !== null;
      case 3:
        return selectedTableNumber !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const canProceedToStep = (step) => {
    for (let i = 1; i < step; i++) {
      if (!isStepValid(i)) return false;
    }
    return true;
  };

  const updateQuantity = (type, id, newQuantity) => {
    if (newQuantity < 1) return;

    if (type === "product") {
      setProductCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      setPackageCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = async (type, id) => {
    setUpdating((prev) => ({ ...prev, [`${type}-${id}`]: true }));

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      if (type === "product") {
        setProductCart((prev) => prev.filter((item) => item.id !== id));
      } else {
        setPackageCart((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setError(error.message || "Failed to remove item from cart");
    } finally {
      setUpdating((prev) => ({ ...prev, [`${type}-${id}`]: false }));
    }
  };

  const applyPromo = () => {
    if (promoCode.toLowerCase() === "save20") {
      setPromoApplied(true);
      setDiscount(20);
    } else {
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  const productTotal = productCart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const packageTotal = packageCart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const durationPrice = durations.find((d) => d.id === selectedDuration)?.price || 0;
  const subtotal = productTotal + packageTotal + durationPrice;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  const getLineStatus = (stepIndex) => {
    if (stepIndex >= steps.length - 1) return "inactive";
    const stepNumber = stepIndex + 1;
    if (currentStep > stepNumber) return "completed";
    if (currentStep === stepNumber) return "active";
    return "inactive";
  };

  const ProgressStep = ({ step, isActive, isCompleted, isClickable, index }) => (
    <div className="relative flex-1 flex flex-col items-center">
      <div
        className={`flex flex-col items-center cursor-pointer transition-all duration-300 z-10 ${
          isClickable ? "hover:scale-105" : "cursor-not-allowed opacity-50"
        }`}
        onClick={() => isClickable && setCurrentStep(step.number)}
      >
        <div
          className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${
            isCompleted
              ? "bg-gradient-to-r from-green-400 to-green-500 border-green-400 shadow-lg shadow-green-200"
              : isActive
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-400 shadow-lg shadow-blue-200"
              : "bg-white border-gray-300 shadow-md"
          }`}
        >
          {isCompleted ? (
            <Check className="w-6 h-6 text-white" />
          ) : (
            <step.icon
              className={`w-5 h-5 md:w-6 md:h-6 ${
                isActive ? "text-white" : "text-gray-400"
              }`}
            />
          )}
          {isActive && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-pulse"></div>
          )}
        </div>
        <div className="text-center">
          <div
            className={`font-semibold text-xs md:text-sm ${
              isActive
                ? "text-blue-600"
                : isCompleted
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            {step.title}
          </div>
          <div className="text-xs text-gray-500 mt-1 hidden md:block max-w-24">
            {step.description}
          </div>
        </div>
      </div>
      {index < steps.length - 1 && (
        <div className="absolute top-6 md:top-8 left-1/2 w-full h-1 flex items-center z-0">
          <div className="w-full relative">
            <div className="w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            <div
              className={`absolute top-0 h-0.5 rounded-full transition-all duration-700 ease-in-out ${
                getLineStatus(index) === "completed"
                  ? "w-full bg-gradient-to-r from-green-400 to-green-500 shadow-sm shadow-green-200"
                  : getLineStatus(index) === "active"
                  ? "w-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm shadow-blue-200"
                  : "w-0 bg-gray-300"
              }`}
            >
              {getLineStatus(index) === "active" && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-pulse border-2 border-blue-400"></div>
                </div>
              )}
            </div>
            {getLineStatus(index) === "completed" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 bg-green-300 rounded-full opacity-60"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const CartItem = ({ item, type, showFeatures = false }) => {
    const isUpdating = updating[`${type}-${item.id}`];

    return (
      <div className="p-4 hover:bg-blue-50/30 transition-all duration-300 border-b border-blue-100/50 last:border-b-0 relative rounded-lg">
        {isUpdating && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
            <Loader className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {item.image && (
            <div className="relative group">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-xl border border-blue-200/50 shadow-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                }}
              />
              <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
            </div>
          )}
          <div className="flex-grow space-y-2">
            <h3 className="font-semibold text-base md:text-lg text-gray-800">
              {item.name}
            </h3>
            <p className="text-blue-600 font-bold text-lg">
              ${(item.price || 0).toFixed(2)}
            </p>
            {showFeatures && item.features && item.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.features.map((feature, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100/70 text-blue-700 text-xs rounded-full border border-blue-200/50">
                    {feature}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(type, item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-10 text-center font-semibold bg-white/70 py-2 rounded-lg border border-blue-200/50 text-sm">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(type, item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="text-lg font-bold text-gray-800">
              ${((item.price || 0) * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeItem(type, item.id)}
              disabled={isUpdating}
              className="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Remove</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StepContent = () => {
    const contentClass = "bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-md";

    const sectionHeaderClass = "bg-gradient-to-r from-blue-100 to-indigo-100 p-4 border-b border-blue-200/30 rounded-t-xl";

    const sectionBodyClass = "bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-b-xl border border-t-0 border-blue-300/50";

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Your Cart Items</h2>
                {userId && <p className="text-sm text-gray-500">User ID: {userId}</p>}
              </div>
              <button
                onClick={refreshCart}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>

            <div className={contentClass}>
              <div className={sectionHeaderClass}>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  Products ({productCart.length})
                </h2>
              </div>
              <div className={sectionBodyClass}>
                {productCart.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                    <p>No products in cart</p>
                  </div>
                ) : (
                  productCart.map((item) => <CartItem key={item.id} item={item} type="product" />)
                )}
              </div>
            </div>

            <div className={contentClass}>
              <div className={sectionHeaderClass}>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  Packages ({packageCart.length})
                </h2>
              </div>
              <div className={sectionBodyClass}>
                {packageCart.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                    <p>No packages selected</p>
                  </div>
                ) : (
                  packageCart.map((item) => <CartItem key={item.id} item={item} type="package" showFeatures />)
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={contentClass}>
            <div className={sectionHeaderClass}>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                Subscription Duration
              </h2>
            </div>
            <div className={sectionBodyClass}>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-600">Loading durations...</span>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 p-4">
                  {durations.map((duration) => (
                    <div
                      key={duration.id}
                      onClick={() => setSelectedDuration(duration.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedDuration === duration.id
                          ? "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-400 shadow-lg shadow-blue-200/50"
                          : "bg-white/70 border-blue-200/50 hover:bg-blue-50/50 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedDuration === duration.id
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedDuration === duration.id && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-bold text-lg text-gray-800">{duration.name}</span>
                          {duration.popular && (
                            <span className="px-2 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-blue-600">${duration.price?.toFixed(2)}</div>
                        {duration.value && <div className="text-sm text-gray-600">{duration.value}</div>}
                        {duration.discount && (
                          <div className="text-sm text-green-600 font-medium bg-green-50 py-1 px-3 rounded-full">
                            {duration.discount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className={contentClass}>
            <div className={sectionHeaderClass}>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                Select Table Number
              </h2>
            </div>
            <div className={sectionBodyClass}>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-600">Loading table numbers...</span>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
                  {tableNumbers.map((tableNumber) => (
                    <div
                      key={tableNumber.id}
                      onClick={() => setSelectedTableNumber(tableNumber.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        selectedTableNumber === tableNumber.id
                          ? "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-400 shadow-lg shadow-blue-200/50"
                          : "bg-white/70 border-blue-200/50 hover:bg-blue-50/50 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <span className="font-bold text-lg text-gray-800">Table {tableNumber.number}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-md">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 border-b border-blue-200/30 rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                  Order Review
                </h2>
              </div>

              <div className="p-4 space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-300/50">
                  <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Products</h3>
                  {productCart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No products in cart</p>
                  ) : (
                    productCart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b border-blue-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48?text=No+Image";
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-800">{item.name}</div>
                            <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-semibold text-gray-800">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-300/50">
                  <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Packages</h3>
                  {packageCart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No packages selected</p>
                  ) : (
                    packageCart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b border-blue-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48?text=No+Image";
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-800">{item.name}</div>
                            <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-semibold text-gray-800">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedDuration && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-300/50">
                    <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Subscription</h3>
                    <div className="flex justify-between items-center py-3">
                      <div>
                        <div className="font-medium text-gray-800">
                          {durations.find((d) => d.id === selectedDuration)?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {durations.find((d) => d.id === selectedDuration)?.value}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-800">
                        ${(durations.find((d) => d.id === selectedDuration)?.price || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTableNumber && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-300/50">
                    <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Table Number</h3>
                    <div className="flex justify-between items-center py-3">
                      <div className="font-medium text-gray-800">
                        Table {tableNumbers.find((t) => t.id === selectedTableNumber)?.number}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-300/50">
                  <h3 className="font-semibold text-gray-800 text-lg mb-4 pb-2 border-b border-blue-200">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount ({discount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-blue-200">
                      <span>Total</span>
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && currentStep <= 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">User ID Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your cart.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-base md:text-lg">Complete your purchase in easy steps</p>
        </div>

        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-start max-w-4xl mx-auto relative">
            {steps.map((step, index) => (
              <ProgressStep
                key={step.number}
                step={step}
                isActive={currentStep === step.number}
                isCompleted={currentStep > step.number}
                isClickable={canProceedToStep(step.number)}
                index={index}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-200/50 rounded-xl text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-grow">{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 flex-shrink-0">
              <Minus className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mb-8">
          <StepContent />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-4 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm p-4 rounded-2xl border border-blue-300/50 shadow-md">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="w-full sm:w-auto order-2 sm:order-1 flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-4 order-1 sm:order-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {steps.length}</span>
          </div>

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={!isStepValid(currentStep)}
              className="w-full sm:w-auto order-3 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={productCart.length === 0 && packageCart.length === 0}
              className="w-full sm:w-auto order-3 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
