import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const authHeader = request.headers.get("authorization");

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    console.log("Sending request to:", `${backendUrl}/uploads/products`);
    console.log("Auth header:", authHeader);

    const response = await fetch(`${backendUrl}/uploads/products`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: authHeader || "",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Upload error details:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
