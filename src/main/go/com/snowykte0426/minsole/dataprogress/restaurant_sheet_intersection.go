package main

import (
	"fmt"
	"log"
	"strings"
	"unicode"

	"github.com/xuri/excelize/v2"
)

func normalize(value string) string {
	v := strings.ToLower(strings.TrimSpace(value))
	v = strings.ReplaceAll(v, " ", "")
	v = strings.ReplaceAll(v, "-", "")
	v = strings.Map(func(r rune) rune {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			return r
		}
		return -1
	}, v)
	return v
}

func main() {
	f1, err := excelize.OpenFile("result/all_restaurant_filtered_data.xlsx")
	if err != nil {
		log.Fatal("파일 열기 오류:", err)
	}
	defer func() {
		if err := f1.Close(); err != nil {
			log.Fatal("파일 닫기 오류:", err)
		}
	}()
	f2, err := excelize.OpenFile("result/model_filtered_data.xlsx")
	if err != nil {
		log.Fatal("파일 열기 오류:", err)
	}
	defer func() {
		if err := f2.Close(); err != nil {
			log.Fatal("파일 닫기 오류:", err)
		}
	}()
	sheet1 := f1.GetSheetName(0)
	sheet2 := f2.GetSheetName(0)
	rows1, err := f1.GetRows(sheet1)
	if err != nil {
		log.Fatal("시트 읽기 오류:", err)
	}
	rows2, err := f2.GetRows(sheet2)
	if err != nil {
		log.Fatal("시트 읽기 오류:", err)
	}
	if len(rows1) == 0 || len(rows2) == 0 {
		log.Fatal("하나 이상의 시트에 데이터가 없습니다.")
	}
	header1 := rows1[0]
	header2 := rows2[0]
	var commonHeaders []string
	indices1 := make(map[string]int)
	indices2 := make(map[string]int)
	for i, col1 := range header1 {
		for j, col2 := range header2 {
			if col1 == col2 {
				commonHeaders = append(commonHeaders, col1)
				indices1[col1] = i
				indices2[col1] = j
				break
			}
		}
	}
	if len(commonHeaders) == 0 {
		log.Fatal("두 시트 간에 공통 헤더가 없습니다.")
	}
	dataMap := make(map[string][]string)
	for i := 1; i < len(rows1); i++ {
		row := rows1[i]
		var keyParts []string
		for _, col := range commonHeaders {
			idx := indices1[col]
			val := ""
			if idx < len(row) {
				val = row[idx]
			}
			normalizedVal := normalize(val)
			keyParts = append(keyParts, normalizedVal)
		}
		key := strings.Join(keyParts, "|")
		dataMap[key] = row
	}
	var commonData [][]string
	commonData = append(commonData, commonHeaders)
	for i := 1; i < len(rows2); i++ {
		row := rows2[i]
		var keyParts []string
		for _, col := range commonHeaders {
			idx := indices2[col]
			val := ""
			if idx < len(row) {
				val = row[idx]
			}
			normalizedVal := normalize(val)
			keyParts = append(keyParts, normalizedVal)
		}
		key := strings.Join(keyParts, "|")
		if rowFromF1, ok := dataMap[key]; ok {
			var commonRow []string
			for _, col := range commonHeaders {
				idx := indices1[col]
				cellVal := ""
				if idx < len(rowFromF1) {
					cellVal = rowFromF1[idx]
				}
				commonRow = append(commonRow, cellVal)
			}
			commonData = append(commonData, commonRow)
		}
	}
	fOut := excelize.NewFile()
	outSheet := fOut.GetSheetName(0)
	for i, row := range commonData {
		for j, cell := range row {
			cellName, err := excelize.CoordinatesToCellName(j+1, i+1)
			if err != nil {
				log.Fatal("셀 좌표 변환 오류:", err)
			}
			_ = fOut.SetCellValue(outSheet, cellName, cell)
		}
	}
	if err := fOut.SaveAs("result/common_data.xlsx"); err != nil {
		log.Fatal("파일 저장 오류:", err)
	}
	fmt.Println("common_data.xlsx 파일이 성공적으로 생성되었습니다.")
}
