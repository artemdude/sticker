
$(function () {

    Sticker = Backbone.Model.extend({
        initialize: function () {
        },
        defaults: {
            Comment: 'Default comment',
            Position: { Top: 200, Left: 200 },
            Theme: 'yellow',
            Size: { Width: 200, Height: 150 }
        },
        validate: function (attrs) {
        },
        url: '/api/stickers/',
        //CRUD operations
        methodUrl: {
            'create': 'create/',
            'update': 'edit/',
            'delete': 'delete/',
            'read': 'get/'
        },
        //override sync to adopt to ASP.NET MVC routes
        sync: function (method, model, options) {
            if (model.methodUrl && model.methodUrl[method.toLowerCase()]) {
                options = options || {};

                if (method.toLowerCase() == 'delete' || method.toLowerCase() == 'read') {
                    options.url = this.url + model.methodUrl[method.toLowerCase()] + this.id
                }
                else {
                    options.url = this.url + model.methodUrl[method.toLowerCase()];
                }
            }

            Backbone.sync(method, model, options);
        }
    });

    var Stickers = Backbone.Collection.extend({
        model: Sticker,
        url: function () {
            return 'api/stickers/';
        },
        initialize: function () {
        }
    });

    var StickerAppModel = Backbone.Model.extend({
        initialize: function () {
            this.stickers = new Stickers();
        }
    });

    var StickerView = Backbone.View.extend({
        tagName: 'div',
        template: $('#stickerTemplate').html(),
        events: {
            'click .sticker': 'focusSticker',
            'dblclick .sticker': 'editStickerMode',
            'click .ok': 'commitEditing',
            'click .cancel': 'cancelEditing',
            'click .remove': 'removeSticker',
            'keypress .comment-box': 'handleShortKeys',
            'mouseenter': 'mouseEnter',
            'mouseleave': 'mouseLeave',
            'click .color': 'colorPick'
        },
        initialize: function () {
            this.render();

            this.model.save();

            this.model.on('destroy', this.remove, this);
            this.model.on('change:Comment', this.editStickerComment, this);
            this.model.on('change:Size', this.changeSize, this);
            this.model.on('change:Theme', this.changeTheme, this);
            this.model.on('error', function (model, error) {
                console.log(error);
            }, this);

        },
        render: function () {
            this.$el.html(Mustache.to_html(this.template, this.model.toJSON()));
            this.setPopupElementsSize();
            this.selectThemeSquare();
            this.$el.addClass('' + this.getThemeCss() + '');
            this.$el.find('.sticker').resizable({
                maxHeight: 450,
                maxWidth: 450,
                minHeight: this.model.defaults.Size.Height,
                minWidth: this.model.defaults.Size.Width,
                resize: _.bind(function (event, ui) {
                    this.setPopupElementsSize();
                }, this),
                stop: _.bind(function (event, ui) {
                    this.model.set({ 'Size':
                                            { Width: parseInt(this.$el.find('.sticker').width()),
                                                Height: parseInt(this.$el.find('.sticker').height())
                                            }
                    });
                }, this)
            });

            this.$el.find('.sticker').draggable({ 'cursor': 'move',
                'containment': '#stickersContainer',
                scroll: false,
                start: _.bind(function (event, ui) {
                    this.focusSticker();
                    this.$el.find('.sticker').addClass('sticker-move');
                }, this),
                stop: _.bind(function (event, ui) {
                    this.$el.find('.sticker').removeClass('sticker-move');
                    this.model.save({ Position: { X: this.$el.find('.sticker').offset().left, Y: this.$el.find('.sticker').offset().top} });
                }, this)
            });
        },
        setPopupElementsSize: function () {
            this.$el.find('.comment').height(parseInt(this.$el.find('.sticker').height()) - 40);
            this.$el.find('.editContainer').height(parseInt(this.$el.find('.sticker').height()) - 40);
            this.$el.find('.comment-box').height(parseInt(this.$el.find('.sticker').height()) - 60);
        },
        changeSize: function () {
            this.$el.find('.sticker').css({ 'height': this.model.get('Size').Height, 'width': this.model.get('Size').Width });
            this.model.save();
        },
        getThemeCss: function () {
            return this.model.get('Theme') + '-theme';
        },
        selectThemeSquare: function () {
            this.$el.find('.color').removeClass('colorCurrent');
            this.$el.find('.color[theme=' + this.model.get('Theme') + ']').addClass('colorCurrent');
        },
        changeTheme: function () {
            this.selectThemeSquare();
            this.$el.attr('class', this.getThemeCss());
            this.model.save();
        },
        colorPick: function (e) {
            this.model.set('Theme', $(e.target).attr('theme'));
        },
        editStickerComment: function (model, options) {
            this.$el.find('.comment').text(this.model.get('Comment'));
            this.model.save();
        },
        editStickerMode: function (e) {
            this.chancheMode();

            this.$el.find('.comment-box').focus();
            this.$el.find('.comment-box').val(this.model.get('Comment'));

            e.stopPropagation();
        },
        //change Comment attribute
        commitEditing: function (e) {
            this.chancheMode();
            this.model.set('Comment', this.$el.find('.comment-box').val());

            e.stopPropagation();
        },
        cancelEditing: function (e) {
            this.chancheMode();

            e.stopPropagation();
        },
        //changing between 'edit' and 'normal' mode
        chancheMode: function () {
            this.$el.find('.comment').toggle();
            this.$el.find('.editSticker').toggle();
        },
        removeSticker: function (e) {
            this.model.destroy();
            e.stopPropagation();
        },
        //show sticker under anouther stickers
        focusSticker: function (e) {
            var maxZindex = $(_.max($('.sticker'), function (sticker) { return $(sticker).css('z-index'); })).css('z-index');
            this.$el.find('.sticker').css('z-index', parseInt(maxZindex) + 1);
        },
        mouseEnter: function (e) {
            this.$el.find('.customize').css('visibility', 'visible');
        },
        mouseLeave: function (e) {
            this.$el.find('.customize').css('visibility', 'hidden');
        },
        handleShortKeys: function (e) {

            if (this.$el.find('.comment-box').is(":focus")) {
                if (e.keyCode == 27) {
                    this.cancelEditing(e);
                }
                else if (e.keyCode == 13) {
                    //change Comment attribute on Enter press
                    this.commitEditing(e);
                }
            }


        }
    });

    var StickerAppView = Backbone.View.extend({
        el: $("#stickersContainer"),
        events: {
            'click #removeAllStickers': 'removeAllStickers',
            'dblclick': 'addStickerOnDblClick',
            'click #addSticker': 'addStickerOnBtnClick',
            'dblclick .main-menu': 'preventDblclickOnMainMenu'
        },
        initialize: function () {
            //init stickersContainer size
            this.$el.css({ 'width': $(document).innerWidth(), 'height': $(document).innerHeight() });
            this.model.stickers.on('add', this.renderSticker, this);
            this.model.stickers.on('remove', this.showCountStickers, this);

            this.fetchData();
        },
        addStickerOnBtnClick: function (e) {
            this.addSticker({});
        },
        addStickerOnDblClick: function (e) {

            this.addSticker({ Position: { Top: e.pageX - 20, Left: e.pageY - 40} });

            //prevent text selection after dblclick
            if (document.selection && document.selection.empty) {
                document.selection.empty();
            } else if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
            }
        },
        fetchData: function () {
            var fetchSuccess = _.bind(function (collection, response) {
                this.model.stickers.forEach(function (model) {
                    this.renderSticker(model);
                }, this);
            }, this);

            this.model.stickers.fetch({
                success: fetchSuccess
            });
        },
        render: function () {
            return this;
        },
        //add sticker to stickers collection
        addSticker: function (model) {
            this.model.stickers.add(model);
        },
        //create view sticker and add it to page
        renderSticker: function (model) {
            var stickerView = new StickerView({ model: model });
            this.$el.append(stickerView.el);
            this.showCountStickers();
        },
        removeAllStickers: function () {
            this.model.stickers.each(function (model) {
                model.destroy({ wait: true });
            });

            this.showCountStickers();
        },
        showCountStickers: function () {
            var count = this.model.stickers.length;

            if (count != 0) {
                this.$el.find('#countSticker').show().text(count);
            }
            else {
                this.$el.find('#countSticker').hide();
            }
        },
        preventDblclickOnMainMenu: function (e) {
            e.stopPropagation();
        }
    });

    //init view
    var stickerAppView = new StickerAppView({ model: new StickerAppModel(), id: 'StickerAppView' });
})