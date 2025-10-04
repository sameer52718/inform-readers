"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import SubmitButton from "@/components/ui/SubmitButton";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import BackButton from "@/components/ui/BackButton";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";
import { useSelector } from "react-redux";

const validationSchema = yup.object().shape({
  categoryId: yup.string().required("Category is required"),
  subCategoryId: yup.string().required("SubCategory is required"),
  name: yup.string().required("Name is required"),
  price: yup.number().required("Price is required"),
});

const EditSalesModel = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const categoryId = watch("categoryId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/common/category", { params: { type: "Specification" } });
        setCategories(data.categories);

        const { data: res } = await axiosInstance.get(`/admin/specification/${id}`);
        if (!res.error) {
          const { categoryId, subCategoryId, name, price } = res.specification;

          reset({ categoryId: categoryId._id, subCategoryId: subCategoryId._id, name, price });
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!categoryId) return;

    const getData = async () => {
      try {
        const { data } = await axiosInstance.get(`/common/subCategory`, { params: { categoryId } });
        setSubCategories(data.subCategories);
      } catch (error) {
        handleError(error);
      }
    };
    getData();
  }, [categoryId]);

  const onSubmit = async (data) => {
    try {
      const { data: res } = await axiosInstance.put(`/admin/specification/${id}`, data);
      if (!res.error) {
        toast.success(res.message);
        router.back();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Loading loading={isLoading}>
      <Card title={"Edit Specification"} headerslot={<BackButton />}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            name={"categoryId"}
            error={errors.categoryId}
            label={"Category"}
            register={register}
            options={categories}
            isRequired
          />
          <Select
            name={"subCategoryId"}
            error={errors.subCategoryId}
            label={"SubCategory"}
            register={register}
            options={subCategories}
            isRequired
          />
          <Textinput
            name={"name"}
            error={errors.name}
            label={"Name"}
            register={register}
            type={"text"}
            placeholder="Enter Name"
            onChange={(e) => setValue("name", e.target.value)}
          />
          <Textinput
            name={"price"}
            error={errors.price}
            label={"Price"}
            register={register}
            type={"text"}
            placeholder="Enter Price"
            onChange={(e) => setValue("price", e.target.value)}
          />

          <div className="col-span-2 text-end">
            <SubmitButton type="submit" isSubmitting={isSubmitting}>
              Update Specification
            </SubmitButton>
          </div>
        </form>
      </Card>
    </Loading>
  );
};

export default EditSalesModel;
