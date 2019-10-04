<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div id="pageContentsBlock">
</div>
<script id="templatePaginationBlock" type="text/x-handlebars-template">
{{#if pagination.totalCount}}
    <ul class="pagination">
    {{#if pagination.existPrePage}}
        <li class="ico first" onClick="searchBlock({{pagination.firstPage}});"></li>
        <li class="ico forward" onClick="searchBlock({{pagination.prePageNo}});"></li>
    {{/if}}

    {{#each pagination.pageList}}
        {{#if (indexCompare this ../pagination.pageNo)}}
            <li class="on"><a href='#'>{{this}}</a></li>
        {{else}}
            <li onClick="searchBlock({{this}});"><a href='#'>{{this}}</a></li>
        {{/if}}
    {{/each}}

    {{#if pagination.existNextPage}}
        <li class="ico back" onClick="searchBlock({{pagination.nextPageNo}});"></li>
        <li class="ico end" onClick="searchBlock({{pagination.lastPage}});"></li>
    {{/if}}
    </ul>
{{/if}}
</script>