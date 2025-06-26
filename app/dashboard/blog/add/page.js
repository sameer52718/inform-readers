/* eslint-disable react/prop-types */
"use client";
import BackButton from "@/components/ui/BackButton.jsx";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Fileinput from "@/components/ui/Fileinput";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import SubmitButton from "@/components/ui/SubmitButton";
import { toast } from "react-toastify";

const schema = yup.object({
  categoryId: yup.string().required("Blog Category is required"),
  subCategoryId: yup.string().required("Blog Sub Category is required"),
  name: yup.string().required("Blog title is required"),
  shortDescription: yup.string().required("Short description is required"),
  blog: yup.string().required("Blog content is required"),
});

const AddBlogForm = ({ type = "Blog", title }) => {
  const [options, setOptions] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [image, setImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({ resolver: yupResolver(schema), mode: "all" });

  const categoryId = watch("categoryId");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data } = await axiosInstance.get(`/common/category`, {
          signal: controller.signal,
          params: {
            type: "Blog",
          },
        });
        if (!data.error) {
          setOptions(data.categories);
        }
      } catch (error) {
        handleError(error);
      }
    })();
    return () => controller.abort();
  }, [type]);

  useEffect(() => {
    if (!categoryId) return;
    const controller = new AbortController();
    (async () => {
      try {
        const { data } = await axiosInstance.get(`/common/subCategory`, {
          signal: controller.signal,
          params: {
            categoryId,
          },
        });
        if (!data.error) {
          setSubCategory(data.subCategories);
        }
      } catch (error) {
        handleError(error);
      }
    })();
    return () => controller.abort();
  }, [categoryId]);

  const onSubmit = async (data) => {
    try {
      if (!image) {
        toast.error("Please select a blog image");
        return;
      }

      const fd = new FormData();
      for (const key in data) {
        fd.append(key, data[key]);
      }

      fd.append("type", type);
      fd.append("image", image);

      const { data: res } = await axiosInstance.post("/user/blog", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res.error) {
        toast.success(res.message);
        reset();
        setImage(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Card title={"Write Blog"} headerslot={<BackButton />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6">
            <Select
              name="categoryId"
              register={register}
              label="Category"
              error={errors.categoryId}
              placeholder="Select Blog Category"
              options={options}
              isRequired
            />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <Select
              name="subCategoryId"
              register={register}
              label="Sub Category"
              error={errors.subCategoryId}
              placeholder="Select Blog Sub Category"
              options={subCategory}
              disabled={subCategory.length === 0}
              isRequired
            />
          </div>
          <div className="col-span-12">
            <Textinput
              name="name"
              type="text"
              register={register}
              label="Title"
              error={errors.name}
              placeholder="Enter Blog Title"
              isRequired
            />
          </div>
          <div className="col-span-12">
            <Textarea
              name={"shortDescription"}
              register={register}
              label="Short Description"
              error={errors.shortDescription}
              placeholder="Enter a short summary"
              isRequired
              row={4}
            />
          </div>
          <div className="col-span-12">
            <Textarea
              name={"blog"}
              register={register}
              label="Blog Content"
              error={errors.blog}
              placeholder="Write your blog content here"
              isRequired
              row={4}
            />
          </div>
          <div className="col-span-12">
            <Fileinput
              placeholder="Select Blog Image"
              label="Browse"
              selectedFile={image}
              preview
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <SubmitButton isSubmitting={isSubmitting}>Submit</SubmitButton>
        </div>
      </form>
    </Card>
  );
};

export default AddBlogForm;
