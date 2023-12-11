import React from "react";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const params = useParams();

  return (
    <div style={{ padding: "100px 120px 60px ", background: "#efefef" }}>
      <ProductDetailComponent productId={params.id} />
    </div>
  );
};

export default ProductDetailPage;
