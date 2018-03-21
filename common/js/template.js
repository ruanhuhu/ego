// 检索App：不存在 或 不为对象
if (!window.App || typeof window.App !== 'object') {
    window.App = {};
}

(function (App) {
    var template = {
        /** 首页主栏中 各区块 Section 模板
         *  {
         *   section_style: string 扩展样式
		 *   icon: string 图标样式
		 *   title: string 标题内容
		 *   cnt: string 内容列表, 替换section-cnt结构
		 *  }
         */
        m_section: Handlebars.compile('<div class="m-section {{ section_style }}">\
            <h4 class="section-head">\
                <span><i class="u-icon {{ icon }}"></i>{{ title }}</span>\
                <span class="section-more">\
                        <a href="javascript:void(0);">更多<i class="u-icon u-icon-moreright"></i></a>\
                 </span>\
            </h4>\
            {{#if cnt}}\
				{{!-- 使用3个{}，可以不转译<>等字符 --}}\
				{{{ cnt }}}\
			{{else}}\
				<div class="section-cnt f-cb"></div>\
			{{/if}}\
        </div>'),

        /** 图片列表
         *  {
		 *   list_style: string 整个content样式
		 *   list: object array [{},{}...]
		 *          {
		 *              img_url: string, 图片url
		 *              img_alt: string, 图片说明
		 *              img_name: string， 图片名称
		 *          }
		 *  }
         */
        img_list: Handlebars.compile('<ul class="section-cnt m-list {{ list_style }} f-cb">\
            {{#each list}}\
                <li>\
                    <a href="javascript:void(0);"><img src="{{ img_url }}" alt="{{ img_alt }}"/></a>\
                    {{#if img_name}}\
                        <p><a href="javascript:void(0);">{{ img_name }}</a></p>\
                    {{/if}}\
                </li>\
            {{/each}}\
        </ul>'),

        /** 活动列表
         *  {
		 *   list_style: string 整个content样式
		 *   act_one: object
		 *          {
		 *              img_url: string, 图片url， 如 BASE_URL+'/res/images/actimg1.jpg'
		 *              img_alt: string, 图片说明， 如 '活动1'
		 *              title: string， 活动名称, 如 '第五期 | 我是活动主题名称'
		 *              date: string, 活动时间， 如 '7.23 - 8.12'
		 *          }
		 *   act_two: object
		 *          {
		 *              img_url: string, 图片url, 如 BASE_URL+'/res/images/actimg2.jpg'
		 *              img_alt: string, 图片说明, 如 '活动2'
		 *              title: string， 活动名称，如 '第五期 | 我是活动主题名称'
		 *              description: string, 活动简介描述等
		 *              date: string, 活动时间，如 '7.30 - 8.23'
		 *          }
		 *  }
         */
        activities_list: Handlebars.compile('<ul class="section-cnt m-list {{ list_style }} f-cb ">\
                <li>\
                    <div class="act-one">\
                        <a href="javascript:void(0);" class="act-img"><img src="{{ act_one.img_url }}" alt="{{ act_one.img_alt }}"></a>\
                        <h6 class="u-title">\
                            <i class="u-icon u-icon-actlogo"></i>\
                            <a>{{ act_one.title }}</a>\
                        </h6>\
                        <div class="u-date u-icon u-icon-actdate">\
                            <p><i class="date">{{ act_one.date }}</i>\
                                <br> 正在进行\
                            </p>\
                        </div>\
                    </div>\
                    <ul class="act-btn">\
                        <li class="u-btn u-btn-primary u-btn-act"><a>快来PK</a></li>\
                        <li class="u-btn u-btn-primary u-btn-act"><a>邀请小伙伴</a></li>\
                    </ul>\
                </li>\
                <li>\
                    <div class="act-two">\
                        <a href="javascript:void(0);" class="act-img"><img src="{{ act_two.img_url }}" alt="{{ act_two.img_alt }}"></a>\
                        <div class="act-info">\
                            <h6 class="u-title">\
                                <i class="u-icon u-icon-actlogo"></i>\
                                <a>{{ act_two.title }}</a>\
                            </h6>\
                            <p class="rule f-thide6">\
                                {{ act_two.description }}\
                            </p>\
                            <span class="u-date u-icon u-icon-actdate">\
                                    <p><i class="date">{{ act_two.date }}</i><br> 正在进行</p>\
                                </span>\
                        </div>\
                    </div>\
                    <ul class="act-btn">\
                        <li class="u-btn u-btn-primary  u-btn-act"><a>快来PK</a></li>\
                        <li class="u-btn u-btn-primary  u-btn-act"><a>邀请小伙伴</a></li>\
                    </ul>\
                </li>\
            </ul>'),


        /** 圈子
         *  {
		 *   list: object array [{},{}...]
		 *          {
		 *              img_url: string, 图片url， 如 BASE_URL+'/res/images/avatar.jpg'
		 *              img_alt: string, 图片说明， 如 '图片'
		 *              group_name: string， 圈子名称, 如 '门口小贩'
		 *              group_members: number, 圈子人数， 如 5221
		 *          }
         */
        aside_groups: Handlebars.compile('<div class="m-section m-groups">\
            <h4 class="section-head toggle">\
                <label><input type="radio" name="groups" value="0" checked><span>活 跃 圈 子</span></label>\
                <label><input type="radio" name="groups" value="1" ><span>创 建 圈 子</span></label>\
            </h4>\
            <ul class="section-cnt m-list f-cb">\
                {{#each list}}\
                     <li class="m-card">\
                        <img src="{{ img_url }}" alt="{{ img_alt }}" class="card-avatar">\
                        <div class="card-info">\
                            <div class="u-name f-thide">{{ group_name }}</div>\
                            <div>\
                                <span>已圈&nbsp;&nbsp;{{ group_members }}人</span>\
                            </div>\
                        </div>\
                    </li>\
                {{/each}}\
            </ul>\
            <span class="section-more">\
                <a href="javascript:void(0);">更多<i class="u-icon u-icon-moreright"></i></a>\
            </span>\
        </div>'),

        /** 热门话题
         *  {
		 *   list: object array [{},{}...]
		 *          {
		 *              topic_url: string, 话题url， 'javascript:void(0);'
		 *              topic_title: string, 话题名称
		 *          }
         */
        aside_hottopic: Handlebars.compile('<div class="m-section m-hottopic">\
            <h4 class="section-head">\
                <span>热 门 话 题</span>\
            </h4>\
            <ul class="section-cnt m-list f-cb">\
                {{#each list}}\
                    <li>\
                        <p><a href="{{ topic_url }}"></a>{{ topic_title }}</p>\
                    </li>\
                 {{/each}}\
            </ul>\
            <span class="section-more">\
                <a href="javascript:void(0);">更多<i class="u-icon u-icon-moreright"></i></a>\
            </span>\
        </div>'),

        /** 排行
         *  {
		 *   list: object array [{},{}...]
		 *          {
		 *              img_url: string, 图片url， 如 BASE_URL+'/res/images/work_small1.jpg'
		 *              img_alt: string, 图片说明， 如 '图片'
		 *              work_name: string， 作品名称, 如 '我是作品名称'
		 *              work_author: string, 作品作者， 如 '用户名'
		 *              work_visit: number, 查看人数, 如 2348
		 *              work_collection: number, 收藏人数，如 421
		 *          }
         */
        aside_toplist: Handlebars.compile('<div class="m-section m-toplist f-pr">\
            <h4 class="section-head" id="sidetabs-wrap">\
                <span class="title">排 行</span>\
            </h4>\
            <ul class="section-cnt m-list f-cb">\
                {{#each list}}\
                    <li class="m-card">\
                        <img src="{{ img_url }}" alt="{{ img_alt }}" class="card-avatar">\
                        <div class="card-info">\
                            <h3 class="work-name f-thide">{{ work_name }}</h3>\
                            <p class="u-name f-thide">{{ work_author }}</p>\
                            <p>查看&nbsp;{{ work_visit }}&nbsp;&nbsp;收藏&nbsp;{{ work_collection }}</p>\
                        </div>\
                    </li>\
                {{/each}}\
            </ul>\
            <span class="section-more">\
                <a href="javascript:void(0);"><i class="u-icon u-icon-moredown"></i></a>\
            </span>\
        </div>'),

        /** 达人
         *  {
		 *   list: object array [{},{}...]
		 *          {
		 *              img_url: string, 图片url， 如 BASE_URL+'/res/images/work_small1.jpg'
		 *              img_alt: string, 图片说明， 如 '图片'
		 *              author_name: string， 圈子名称, 如 'Grinch'
		 *              works_num: number, 圈子人数， 如 377
		 *              fans_num: number, 粉丝数量，如 1706
		 *          }
         */
        aside_startoplist: Handlebars.compile('<div class="m-section m-startoplist f-pr">\
            <h4 class="section-head">\
                <span class="title">达 人 排 行 榜</span>\
            </h4>\
            <ul class="section-cnt m-list f-cb">\
                {{#each list}}\
                    <li class="m-card">\
                        <img src="{{ img_url }}" alt="{{ img_alt }}" class="card-avatar">\
                        <div class="card-info">\
                            <h3 class="u-name f-thide">{{ author_name }}</h3>\
                            <p>作品&nbsp;{{ works_num }}&nbsp;&nbsp;粉丝&nbsp;{{ fans_num }}</p>\
                        </div>\
                    </li>\
                {{/each}}\
            </ul>\
            <span class="section-more">\
                <a href="javascript:void(0);"><i class="u-icon u-icon-moredown"></i></a>\
            </span>\
        </div>\
    </div>'),

    };

    App.template = template;
})(window.App);