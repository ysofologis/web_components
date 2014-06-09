<todos-app>
    <h2>Todays to-dos</h2>
    {{#selectedTodo}}
    <input type="text"
           can-value="description"
           can-change="save">
    {{/selectedTodo}}
    <ul>
        {{#each todos}}
        <li>
            <input type="checkbox"
                   can-value="complete">
            <span class="{{#if complete}}done{{/if}}"
                  can-click="select">
                {{description}}
            </span>
            <button can-click="destroy"></button>
        </li>
        {{/each}}
    </ul>
</todos-app>
