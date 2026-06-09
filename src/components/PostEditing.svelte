<script lang=`ts">
  import { marked } from "marked";
  export let content = "";

  let preview = false;
</script>

<input type="checkbox" bind:checked={preview} id="preview" />
<label for="preview">Preview</label>

<textarea bind:value={content} name="content" style={`min-width: 760px; max-width: 760px; height: 500px; ${preview ? "visibility: hidden; position: absolute;" : ""}`}></textarea>
<div style={`text-align: left; max-width: 760px;  ${preview ? "" : "visibility: hidden; position: absolute;"}`}>{@html marked(content)}</div>