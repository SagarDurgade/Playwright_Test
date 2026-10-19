---
agent: agent
model: Claude Sonnet 5.5

tools: [vscode, execute/runInTerminal, execute/getTerminalOutput, read/readFile, edit/editFiles, search]

description: Analyzes Playwright test failures from playwright-report/results.xml and generates a focused CSV report with: #, Date and Time (CET), TestKey, FailingCodeSnippet, Test Cases Execution Time, PageObjectLocation, ShortErrorMessage.
---

## INSTRUCTIONS

Parse `playwright-report/results.xml` and produce a single CSV file at `downloads/<yyyyMMdd_HHmmss>.csv` (filename based on the **test cases execution date/time** read from the `timestamp` attribute of the first `<testsuite>` element in the XML, converted to CET) containing **only failed test cases** with the 7 columns listed below.

---

## 1. Data Source

- **File**: `playwright-report/results.xml` (JUnit XML format).
- **Failed tests**: Any `<testcase>` element that contains a `<failure>` child node.
- **Key XML fields to read per failed testcase**:
  - `timestamp` attribute on the parent `<testsuite>` element → suite start time in UTC (e.g. `2026-02-27T11:43:01.292Z`). Convert to CET (UTC+1 Nov–Mar, UTC+2 Apr–Oct) for `Date and Time`.
  - `time` attribute on `<testcase>` → duration in seconds → used for `Test Cases Execution Time` column.
  - `<property name="test_key">` inside `<properties>` → JIRA test key (e.g. `CEBRA-5055`)
  - `name` attribute on `<testcase>` → full test name
  - `<failure>` CDATA block → stack trace (used for `PageObjectLocation` and `FailingCodeSnippet`)
  - `<failure message="...">` attribute → short error message
  - `<system-err>` CDATA → validation error details (append to error message if present)

---

## 2. Column Definitions

Generate the CSV with exactly these 7 columns **in this order**:

| # | Column Name | How to extract |
|---|---|---|
| 1 | `#` | Sequential row number starting at 1 |
| 2 | `Date and Time` | Convert the parent `<testsuite>` `timestamp` attribute (UTC ISO-8601) to CET. Format as `YYYY-MM-DD HH:mm:ss CET` (or `CEST` in summer), e.g. `2026-02-27 12:43:01 CET`. |
| 3 | `TestKey` | Value of `<property name="test_key">` inside `<properties>`. Empty string if missing. |
| 4 | `FailingCodeSnippet` | Extract the line marked with `>` (the arrow indicator) from the `<failure>` CDATA code block. Return **only the code text** (e.g. `expect(await pages.blue.verifyKsuValue('0.1')).toBe(true)`), without the line number. Empty string if not found. |
| 5 | `Test Cases Execution Time` | `time` attribute from `<testcase>` formatted as `58.407s`. |
| 6 | `PageObjectLocation` | Extract from the `<failure>` CDATA stack trace: find the **first** line matching `at ClassName.methodName (/app/PageObjectModel/FileName.ts:LineNumber)` and format as `FileName.ts:LineNumber [methodName]`. Empty string if none found. |
| 7 | `ShortErrorMessage` | Combine: (a) `message` attribute of `<failure>` element (first 150 chars), then append ` | ` and (b) first non-empty line from `<system-err>` CDATA (up to 150 chars). If `<system-err>` is empty, use only the `<failure message>`. Total cap: 300 chars. |

---

## 3. Extraction Rules

### FailingCodeSnippet (column 4)
In the `<failure>` CDATA, find the line starting with `>` followed by a line number and code:
```
> 63 |     expect(await pages.blue.verifyKsuValue('0.1')).toBe(true)
```
Strip the leading `>`, the line number, the `|` separator, and extra whitespace. Return **only the code text**: `expect(await pages.blue.verifyKsuValue('0.1')).toBe(true)`.  
If multiple retries exist in the CDATA, use the snippet from the **first** (non-retry) failure only.

### PageObjectLocation (column 6)
Search the `<failure>` CDATA for lines of the pattern:
```
at SomeClass.someMethod (/app/PageObjectModel/SomeFile.ts:123:45)
```
Take the **first** such match and return `SomeFile.ts:123 [someMethod]`.  
If no PageObjectModel line exists, check for `/app/tests/` lines and return `FileName.spec.ts:LineNumber`.

### ShortErrorMessage (column 7)
- Take `<failure message="...">` attribute value, strip newlines, trim to 150 chars.
- If `<system-err>` has content, take its first meaningful line (skip blank lines), strip newlines, trim to 150 chars.
- Combine as: `[failure message] | [system-err first line]`
- If no `<system-err>`, use only the failure message.
- Final value must not exceed 300 chars.

---

## 4. Sorting

- **Sort all rows A to Z (ascending) by the `TestKey` column** before writing to CSV.
- Re-number the `#` column sequentially (1, 2, 3 …) after sorting.

---

## 5. CSV Formatting Rules

- **Encoding**: UTF-8.
- **Header row**: Always present as the first line.
- **Quoting**: Wrap every field value in double-quotes (`"`).
- **Escaping**: Escape internal double-quotes by doubling them (`""`).
- **No newlines inside fields**: Replace `\r\n`, `\r`, `\n` with a single space before writing.
- **Whitespace**: Collapse multiple consecutive spaces into one.

---

## 5. PowerShell Implementation

Use PowerShell with `[xml]` XML parsing. Key patterns:

```powershell
Set-Location "<workspace-root>"
[xml]$xml = Get-Content "playwright-report\results.xml" -Encoding UTF8

# Get CDATA from a node
function GetCDATA($node) {
    $t = $node.'#text'
    if (-not $t) { $t = $node.InnerText }
    return [string]$t
}

# Sanitize and quote for CSV
function Q([string]$s) {
    $s = $s -replace "`r`n|`r|`n", " " -replace "\s{2,}", " "
    return '"' + ($s.Trim() -replace '"','""') + '"'
}

# Convert UTC ISO timestamp from <testsuite> to CET/CEST date-time string (no duration)
function GetDateTimeCET([string]$utcTimestamp) {
    try {
        $utc = [datetime]::Parse($utcTimestamp, $null, [System.Globalization.DateTimeStyles]::RoundtripKind)
        # Determine offset: CET = UTC+1 (Nov-Mar), CEST = UTC+2 (Apr-Oct)
        $month = $utc.Month
        $offset = if ($month -ge 4 -and $month -le 10) { 2 } else { 1 }
        $label  = if ($offset -eq 2) { "CEST" } else { "CET" }
        $local  = $utc.AddHours($offset)
        return ($local.ToString("yyyy-MM-dd HH:mm:ss") + " " + $label)
    } catch {
        return $utcTimestamp + " UTC"
    }
}

# Format test case duration as "Xs"
function GetExecTime([string]$durationSec) {
    return $durationSec + "s"
}

# Extract PageObjectLocation
function GetPOLine([string]$cdata) {
    if ($cdata -match 'at \S+\.(\w+) \(/app/PageObjectModel/([\w.]+):(\d+)') {
        return ($Matches[2] + ":" + $Matches[3] + " [" + $Matches[1] + "]")
    }
    if ($cdata -match 'at /app/tests/([^\s]+):(\d+):\d+') {
        $f = $Matches[1] -replace '^.+[/\\]', ''
        return ($f + ":" + $Matches[2])
    }
    return ""
}

# Extract FailingCodeSnippet (first occurrence only, before any "Retry #") - code text only, no line number
function GetSnippet([string]$cdata) {
    $firstAttempt = $cdata
    if ($cdata -match '(?s)^(.*?)Retry #1') { $firstAttempt = $Matches[1] }
    if ($firstAttempt -match '> \d+ \|([^\r\n]+)') {
        return $Matches[1].Trim()
    }
    return ""
}

# Extract test key from properties
function GetTestKey($tc) {
    $prop = $tc.properties.property | Where-Object { $_.name -eq "test_key" } | Select-Object -First 1
    if ($prop) { return $prop.value }
    return ""
}

# Collect all failures into objects, then sort A-Z by TestKey, then write CSV
$rows = @()
foreach ($suite in $xml.testsuites.testsuite) {
    foreach ($tc in $suite.testcase) {
        if (-not $tc.failure) { continue }
        $cdata  = GetCDATA($tc.failure)
        $sysErr = GetCDATA($tc.'system-err')
        $rows += [PSCustomObject]@{
            TestKey  = GetTestKey($tc)
            ExecDT   = GetDateTimeCET $suite.timestamp
            ExecTime = GetExecTime $tc.time
            POLine   = GetPOLine($cdata)
            Snippet  = GetSnippet($cdata)
            ErrorMsg = GetErrorMsg $tc.failure.message $sysErr
        }
    }
}
$sorted = $rows | Sort-Object { $_.TestKey }   # A to Z

$lines = @('"#","Date and Time","TestKey","FailingCodeSnippet","Test Cases Execution Time","PageObjectLocation","ShortErrorMessage"')
$n = 1
foreach ($r in $sorted) {
    $lines += (Q($n.ToString())) + "," + (Q($r.ExecDT)) + "," + (Q($r.TestKey)) + "," + (Q($r.Snippet)) + "," +
              (Q($r.ExecTime))  + "," + (Q($r.POLine))  + "," + (Q($r.ErrorMsg))
    $n++
}
# Generate output filename from test execution date (first testsuite timestamp, converted to CET)
$firstTimestamp = $xml.testsuites.testsuite | Select-Object -First 1 | ForEach-Object { $_.timestamp }
try {
    $utcTs = [datetime]::Parse($firstTimestamp, $null, [System.Globalization.DateTimeStyles]::RoundtripKind)
    $tsMonth = $utcTs.Month
    $tsOffset = if ($tsMonth -ge 4 -and $tsMonth -le 10) { 2 } else { 1 }
    $tsLocal = $utcTs.AddHours($tsOffset)
    $timestamp = $tsLocal.ToString("yyyyMMdd_HHmmss")
} catch {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
}
$outPath = "downloads\$timestamp.csv"
[System.IO.File]::WriteAllLines($outPath, $lines, [System.Text.Encoding]::UTF8)

# Build ShortErrorMessage
function GetErrorMsg([string]$failMsg, [string]$sysErr) {
    $a = ($failMsg -replace "`r`n|`r|`n"," ").Trim()
    if ($a.Length -gt 150) { $a = $a.Substring(0,150) }
    if ($sysErr -and $sysErr.Trim().Length -gt 0) {
        $lines = ($sysErr -split "`n") | Where-Object { $_.Trim().Length -gt 0 }
        if ($lines.Count -gt 0) {
            $b = $lines[0].Trim() -replace "`r","" 
            if ($b.Length -gt 150) { $b = $b.Substring(0,150) }
            $combined = $a + " | " + $b
            if ($combined.Length -gt 300) { $combined = $combined.Substring(0,300) }
            return $combined
        }
    }
    return $a
}
```

---

## 6. Output

- **File path**: `downloads/<yyyyMMdd_HHmmss>.csv` — filename is derived from the **test execution date/time** (the `timestamp` attribute of the first `<testsuite>` in the XML, converted to CET), e.g. `downloads/20260227_124301.csv`.
- Each run creates a **new file**; no overwriting of previous runs.

---

## 7. Validation

After writing the file:
1. Print: `Rows written (excluding header): N` — must equal the number of `<testcase>` elements with `<failure>`.
2. Print: `File saved: downloads/<generated-filename>.csv`
3. Show the first 3 data rows in the terminal for a quick sanity check.

---

## 8. Re-run Behavior

- Each run generates a **new CSV file** named with the **test execution date/time** from the XML (e.g. `downloads/20260227_124301.csv`).
- If a file with the same execution timestamp already exists it will be overwritten (same test run re-analysed).
- Previous run files for different execution timestamps are preserved in the `downloads/` folder.
