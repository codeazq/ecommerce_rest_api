import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import {
  createProductService,
  getAllProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
} from "../services/productServices";

// create a new product controller
export const create_product = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    // calling the createProduct controller
    const newProduct = await createProductService(req.body);
    //console.log(newProduct);
     res
      .status(StatusCodes.CREATED)
      .json({ ProductData: { ProductDetail: newProduct } });
  }
);

// get all products controller
export const get_all_products = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Filtering products
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObject[el]);
    // console.log(queryObject, req.query);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = getAllProductsService();
    console.log(query);

    // Sorting Products
/*       if (req.query.sort) {
    let sortBy: string[] = req.query.sort as string[] 
    let new_sortBy = sortBy.join("");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  } */

    // Limiting the Fields
/*       if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  } */

    const product = await query;

    // console.log(req.query);
    // console.log(allprods);
    res
      .status(StatusCodes.OK)
      .json({ numberOfProducts: product.length, product });
  }
);

// getting a single product
export const getASingleProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    //console.log(id);
    const productDataID = await getSingleProductService(id);
    res.status(StatusCodes.OK).json({ product: productDataID });
  }
);

// update a single product controller
export const updateSingleProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    const { id } = req.params;
    console.log(id);
    const updateProduct = await updateProductService(id, req.body);
    res
      .status(StatusCodes.OK)
      .json({ status: "Successfully updated product", updateProduct });
  }
);

// Deleting a product controller action
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const productDataID = await deleteProductService(id);
    res.status(StatusCodes.OK).json({
      status: "Deleted product Successfully",
      productDataID: productDataID,
    });
  }
);