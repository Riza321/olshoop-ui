import * as React from "react";
import menus from "./menus";
import TopBar from "../../components/TopBar";
// import { colors } from "../../styles/colors";

import {
  SideNav,
  LayoutSidebar,
  Responsive,
  CardProduct,
  Pagination,
  InputText,
  // Pill,
} from "upkit";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../../config";
import {
  fetchProducts,
  setPage,
  goToNextPage,
  goToPrevPage,
  setKeyword,
  setCategory,
  // toggleTag,
  decStockProduct,
} from "../../features/Products/actions";
import { BounceLoader } from "react-spinners";
// import { tags } from "./tags";
import Cart from "../../components/Cart";
import { addItem, removeItem } from "../../features/Cart/actions";
import { useHistory } from "react-router-dom";

export default function Home() {
  let dispatch = useDispatch();
  let products = useSelector((state) => state.products);
  let cart = useSelector((state) => state.cart);
  let history = useHistory();

  React.useEffect(() => {
    dispatch(fetchProducts());
  }, [
    dispatch,
    products.currentPage,
    products.keyword,
    products.category,
    products.tags,
    products.stock,
  ]);

  return (
    <div>
      <LayoutSidebar
        sidebar={
          <SideNav
            items={menus}
            verticalAlign="top"
            active={products.category}
            onChange={(category) => dispatch(setCategory(category))}
          />
        }
        content={
          <div className="md:flex w-full md:flex-row-reverse w-full mr-5 h-full min-h-screen">
            <div className="w-full md:w-3/4 pl-5 pb-10">
              <TopBar />

              <div className="w-full text-center mb-10 mt-5">
                <InputText
                  fullRound1
                  value={products.keyword}
                  placeholder="cari obat..."
                  fitContainer
                  onChange={(e) => {
                    dispatch(setKeyword(e.target.value));
                  }}
                />
              </div>

              {/* <div className="mb-5 pl-2 flex w-3/3 overflow-auto pb-5">
                {tags[products.category].map((tag, index) => {
                  //tags[products.category] -> ditampilkan berdsarkan menu / kategori yang aktif,
                  return (
                    <div key={index}>
                      <Pill
                        text={tag}
                        icon={tag.slice(0, 1).toUpperCase()}
                        isActive={products.tags.includes(tag)}
                        onClick={(_) => dispatch(toggleTag(tag))}
                      />
                    </div>
                  );
                })}
              </div> */}

              {products.status === "process" && !products.data.length ? (
                <div className="flex justify-center">
                  <BounceLoader color="red" />
                </div>
              ) : null}

              <Responsive desktop={3} items="stretch">
                {products.data.map((product, index) => {
                  return (
                    <div key={index} className="p-2">
                      <CardProduct
                        title={product.name}
                        imgUrl={`${config.api_host}/upload/${product.image_url}`}
                        price={product.price}
                        onAddToCart={(_) => {
                          if (product.stock > 0) {
                            dispatch(addItem(product));
                            dispatch(decStockProduct(product));
                            console.log("name product:", product.name);
                            console.log("stock product:", product.stock);
                          } else {
                            window.alert("Oops..! \nStok habis.");
                            console.log("Stock habis");
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </Responsive>

              <div className="text-center my-10">
                <Pagination
                  totalItems={products.totalItems}
                  page={products.currentPage}
                  perPage={products.perPage}
                  onChange={(page) => dispatch(setPage(page))}
                  onNext={(_) => dispatch(goToNextPage())}
                  onPrev={(_) => dispatch(goToPrevPage())}
                />
              </div>
            </div>

            <div className="w-full md:w-1/4 h-full shadow-lg border-r border-white bg-gray-100">
              <Cart
                items={cart}
                onItemInc={(item) => {
                  dispatch(addItem(item));
                  dispatch(decStockProduct(products.data));
                }}
                onItemDec={(item) => {
                  dispatch(removeItem(item));
                  dispatch(decStockProduct(products.data));
                }}
                onCheckout={(_) => {
                  history.push("/checkout");
                }}
              />
            </div>
          </div>
        }
        sidebarSize={80}
      />
    </div>
  );
}
