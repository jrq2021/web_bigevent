$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
    initEditor()

    function initCate() {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 一定要记得调用form.render 方法
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function() {
            console.log('121');
            $('#coverFile').click()
        })
        // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数据
        var files = e.target.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_status = '已发布'

    // 为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
            art_status = '草稿'
        })
        //  为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        // 1、阻止表单的默认提交事件
        e.preventDefaults()

        // 2、基于form表单，快速创建一个formDate对象
        var fd = new FormData($(this)[0])

        // 3、将文章的发布状态，存到fd中
        fd.append('state', art_status)

        // 4、将封面图片裁剪过后的图片，转换为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5、将文件对象存储到fd中
                fd.append('cover_img', blob)

                // 6、发起Ajax数据请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发表文章失败！')
                }
                layer.msg('发表文章成功！')
                location.href('/article/art_list.html')
            }
        })
    }
})