<template>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;600;700&display=swap" rel="stylesheet">
<div>
    <h1>Simple HTML Table</h1>
</div>
  <div>
    <table>
      <thead>
        <tr>
            <th class="theader" colspan="3">Personal Information</th>
        </tr>
        <tr class="th">
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Age</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>souly</td>
          <td>homphet</td>
          <td class="th">25</td>
        </tr>
        <tr>
          <td>ສຸລີ</td>
          <td>ຫົມເພັດ</td>
          <td class="th">25</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
</script>

<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

.tr:nth-child(even) {
  background-color: #dddddd;
}
.table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
.th {
  text-align: center;
}
.theader {
  font-weight: bold;
  text-align: center;
  font-size: 22px;
  border: 1px solid black;
}
h1 {
  text-align: center;
  font-weight: bold;
}
body {
    font-family: 'Times New Roman','Noto Sans Lao', Times, serif;
}
</style>
