<template>
  <div class="container">
    <h1 class="title">Download Bills by Month</h1>

    <!-- Year Selector -->
    <div class="year-selector">
      <label for="year-select" class="label">Select Year:</label>
      <select id="year-select" v-model="selectedYear" @change="updateMonths" class="dropdown">
        <option v-for="year in availableYears" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <!-- Table -->
    <table class="modern-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="month in months" :key="month.value">
          <td>{{ month.label }}</td>
          <td>
            <button
              class="download-button"
              :disabled="downloadedMonths.includes(month.value)"
              @click="downloadDataByMonth(month.value)"
            >
              {{ downloadedMonths.includes(month.value) ? "Downloaded" : "Download" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  data() {
    return {
      selectedYear: new Date().getFullYear(), // Default to the current year
      availableYears: [2024, 2025, 2026], // List of selectable years
      months: [], // Will hold the dynamically generated months
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlUyRnNkR1ZrWDErdE9ja29vVDV0NXdqWlBqTzhVc0V1ZnR2QytPUXp3Z2ljWkFPdkhNUkNqdzh0NUhOSENBRVZsVXVNWHBrc1RudUFxaUE3R0VtVExRSTZMaWNTVUlaN1BMb0xGOVczMWtjWnFoQmxFUThHVUFwSFpNS0NDVjN1RURhWDJSSjFwZDNqaFRGc2lmdUF3Zz09IiwiaWF0IjoxNzA5MDEwNjU0fQ.mhmfUuasPQnAtxTQmwIyofClMuOAKVKZloNskpG9fHo",
      downloadedMonths: [], // Track which months have been downloaded
    };
  },
  methods: {
    updateMonths() {
      this.months = [
        { label: "January", value: `01${this.selectedYear}` },
        { label: "February", value: `02${this.selectedYear}` },
        { label: "March", value: `03${this.selectedYear}` },
        { label: "April", value: `04${this.selectedYear}` },
        { label: "May", value: `05${this.selectedYear}` },
        { label: "June", value: `06${this.selectedYear}` },
        { label: "July", value: `07${this.selectedYear}` },
        { label: "August", value: `08${this.selectedYear}` },
        { label: "September", value: `09${this.selectedYear}` },
        { label: "October", value: `10${this.selectedYear}` },
        { label: "November", value: `11${this.selectedYear}` },
        { label: "December", value: `12${this.selectedYear}` },
      ];
    },
    async downloadDataByMonth(month) {
      const apiUrl = `http://202.137.141.244:3000/v3/api/loans/allbillmonth/${month}`;

      try {
        const response = await fetch(apiUrl, {
          headers: {
            Auth: this.token,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${month}: ${response.statusText}`);
        }

        const data = await response.json();

        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(jsonBlob);
        downloadLink.download = `bill_month_${month}.json`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Add the month to the downloaded list
        this.downloadedMonths.push(month);

        // SweetAlert success message
        Swal.fire({
          icon: "success",
          title: "Download Complete",
          text: `The data for ${month} has been successfully downloaded!`,
          confirmButtonText: "OK",
        });

        console.log(`File for month ${month} downloaded successfully!`);
      } catch (error) {
        console.error(`Error downloading the file for month ${month}:`, error);

        // SweetAlert error message
        Swal.fire({
          icon: "error",
          title: "Download Failed",
          text: `There was an issue downloading data for ${month}. Please try again later.`,
          confirmButtonText: "OK",
        });
      }
    },
  },
  mounted() {
    this.updateMonths();
  },
};
</script>

<style scoped>
/* Styling (Same as before) */
.container {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.year-selector {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  font-size: 16px;
  font-weight: bold;
}

.dropdown {
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border 0.3s;
}

.dropdown:focus {
  border: 1px solid #007bff;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.modern-table th,
.modern-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.modern-table th {
  background-color: #f4f4f4;
  color: #333;
  text-transform: uppercase;
}

.modern-table tr:hover {
  background-color: #f1f1f1;
}

.download-button {
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.download-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.download-button:hover:enabled {
  background-color: #0056b3;
  transform: scale(1.05);
}

.download-button:active {
  transform: scale(1);
}
</style>
