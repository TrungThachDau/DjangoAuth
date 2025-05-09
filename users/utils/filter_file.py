def filter_file(file):
        music = ['MP3']
        video = ['MP4','AVI','MKV']
        image = ['PNG','JPG','JPEG','GIF']
        document = ['JSON']

        file_extension = file.name.split('.')[-1].upper()
        file_size = file.size
        if file_extension not in music + video + image + document: 
            raise ValueError(f"File {file} {file_extension} is not a valid image format. File size: {round((file_size/1024/1024),0)} MB.")
        if file_size > 5 * 1024 * 1024 and file_extension in image:
            raise ValueError(f"File {file} is too large. Maximum size is 5.0 MB. File size: {round((file_size/1024/1024),0)} MB.")
        if file_size > 5 * 1024 * 1024 and file_extension in document:
            raise ValueError(f"File {file} is too large. Maximum size is 10.0 MB. File size: {file_size/1024/1024} MB.")
        if file_size > 100 * 1024 * 1024 and file_extension in video:
            raise ValueError(f"File {file} is too large. Maximum size is 50.0 MB. File size: {file_size/1024/1024} MB.")
        if file_size > 5 * 1024 * 1024 and file_extension in music:
            raise ValueError(f"File {file} is too large. Maximum size is 20.0 MB. File size: {file_size/1024/1024} MB.")
        return True