let htmlEditor, cssEditor, jsEditor;

window.onload = () => {
  htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlEditor"), {
    mode: "htmlmixed",
    theme: "material",
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    smartIndent: true,
    matchTags: { bothTags: true },
    extraKeys: {
      "Enter": "newlineAndIndentContinueMarkup"
    }
  });

  cssEditor = CodeMirror.fromTextArea(document.getElementById("cssEditor"), {
    mode: "css",
    theme: "material",
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    smartIndent: true
  });

  jsEditor = CodeMirror.fromTextArea(document.getElementById("jsEditor"), {
    mode: "javascript",
    theme: "material",
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    smartIndent: true
  });

  setupTabSwitching();

  document.getElementById("themeToggle").addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    const theme = isLight ? "default" : "material";

    htmlEditor.setOption("theme", theme);
    cssEditor.setOption("theme", theme);
    jsEditor.setOption("theme", theme);

    document.getElementById("themeToggle").textContent = isLight
      ? "🌙 Toggle Theme"
      : "☀️ Toggle Theme";
  });
};

document.getElementById("beautify").addEventListener("click", () => {
  const formattedHTML = html_beautify(htmlEditor.getValue(), {
    indent_size: 2,
    wrap_line_length: 80
  });

  const formattedCSS = css_beautify(cssEditor.getValue(), {
    indent_size: 2
  });

  const formattedJS = js_beautify(jsEditor.getValue(), {
    indent_size: 2
  });

  htmlEditor.setValue(formattedHTML);
  cssEditor.setValue(formattedCSS);
  jsEditor.setValue(formattedJS);
});


function setupTabSwitching() {
  const tabs = document.querySelectorAll(".tab");
  const editors = {
    html: document.getElementById("htmlWrap"),
    css: document.getElementById("cssWrap"),
    javascript: document.getElementById("jsWrap"), // fixed key
  };

  const editorMap = ["html", "css", "javascript"];

  tabs.forEach((tab, i) => {
    const name = editorMap[i]; // fixed mapping by index

    tab.addEventListener("click", () => {
      // Toggle tab active
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Toggle editor visibility
      Object.values(editors).forEach(e => e.classList.remove("active"));
      if (editors[name]) editors[name].classList.add("active");

      // Refresh CodeMirror view
      if (name === "html") htmlEditor.refresh();
      if (name === "css") cssEditor.refresh();
      if (name === "javascript") jsEditor.refresh();
    });
  });
}

document.getElementById("run").addEventListener("click", () => {
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();

  const output = `
    <html>
      <head><style>${css}</style></head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
    </html>
  `;

  document.getElementById("output").srcdoc = output;
});

document.addEventListener("keydown", (e) => {
  // Run: Ctrl + Enter
  if (e.ctrlKey && e.key === "Enter") {
    e.preventDefault();
    document.getElementById("run").click();
  }

  // Switch tabs: Alt + 1 / 2 / 3
  if (e.altKey) {
    if (e.key === "1") {
      document.querySelectorAll(".tab")[0].click(); // HTML
    } else if (e.key === "2") {
      document.querySelectorAll(".tab")[1].click(); // CSS
    } else if (e.key === "3") {
      document.querySelectorAll(".tab")[2].click(); // JavaScript
    }
  }
});
