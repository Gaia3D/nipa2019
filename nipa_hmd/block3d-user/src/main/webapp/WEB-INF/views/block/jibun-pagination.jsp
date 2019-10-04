<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="pageContentsJibun">
</div>
<script id="templatePaginationJibun" type="text/x-handlebars-template">
{{#if pagination.totalCount}}
    <ul class="pagination">
    {{#if pagination.existPrePage}}
        <li class="ico first" onClick="searchJibun({{pagination.firstPage}});"></li>
        <li class="ico forward" onClick="searchJibun({{pagination.prePageNo}});"></li>
    {{/if}}

    {{#each pagination.pageList}}
        {{#if (indexCompare this ../pagination.pageNo)}}
            <li class="on"><a href='#'>{{this}}</a></li>
        {{else}}
            <li onClick="searchJibun({{this}});"><a href='#'>{{this}}</a></li>
        {{/if}}
    {{/each}}

    {{#if pagination.existNextPage}}
        <li class="ico back" onClick="searchJibun({{pagination.nextPageNo}});"></li>
        <li class="ico end" onClick="searchJibun({{pagination.lastPage}});"></li>
    {{/if}}
    </ul>
{{/if}}
</script>