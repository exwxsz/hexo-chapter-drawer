import os
import json

# 🔥 配置：这里填你【本地图片的根目录】
# 比如你的本地路径是 D:\图片\me-de-tupian\images\chapters\个人烤肉
ROOT_FOLDER = r"D:\github projects\me-de-tupian\images\chapters\个人烤肉"

# 支持的图片格式（可自行添加）
IMAGE_EXTS = (".png", ".jpg", ".jpeg", ".gif", ".webp")

def generate_list_json(folder_path):
    """遍历文件夹，生成list.json"""
    # 获取当前文件夹所有图片
    images = []
    for file in os.listdir(folder_path):
        # 过滤图片文件
        if file.lower().endswith(IMAGE_EXTS):
            images.append(file)
    
    # 没有图片则跳过
    if not images:
        return
    
    # 生成list.json路径
    json_path = os.path.join(folder_path, "list.json")
    
    # 写入文件（格式化）
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(images, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 生成成功：{json_path}")

def scan_all_folders(root):
    """递归扫描所有子文件夹"""
    for dirpath, dirnames, filenames in os.walk(root):
        # 为每个文件夹生成list.json
        generate_list_json(dirpath)

if __name__ == "__main__":
    print("🚀 开始批量生成 list.json...")
    scan_all_folders(ROOT_FOLDER)
    print("\n🎉 所有章节 list.json 生成完成！")
    input("按回车键退出...")