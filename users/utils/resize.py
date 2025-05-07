from PIL import Image
import io

def resize_image(image_bytes):
    # Mở hình ảnh từ dữ liệu bytes
    image = Image.open(image_bytes)
    if image is None:
        raise ValueError("Invalid image data")

    # Lấy kích thước gốc và tính toán kích thước mới
    original_width, original_height = image.size
    new_width = int(original_width / 7)
    new_height = int(original_height / 7)

    # Resize hình ảnh
    resized_image = image.resize((new_width, new_height), Image.Resampling.NEAREST)

    # Lưu hình ảnh đã resize vào BytesIO
    resized_image_bytes = io.BytesIO()
    resized_image.save(resized_image_bytes, format=image.format)
    resized_image_bytes.seek(0)  # Đặt lại con trỏ về đầu stream

    return resized_image_bytes


