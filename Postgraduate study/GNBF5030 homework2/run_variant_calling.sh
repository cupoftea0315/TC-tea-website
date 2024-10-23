#!/bin/bash

# Inputs:
# sorted_bam_file - the path to the sorted and indexed BAM file
# reference_genome - the path to the reference genome file
# output_vcf - the prefix path for the output VCF file

sorted_bam_file=$1
reference_genome=$2
output_vcf=$3  # only <prefix> !!!

# Calculate the coverage using mpileup
bcftools mpileup -O b -o ${output_vcf}_raw.bcf -f $reference_genome $sorted_bam_file

# Call variants using bcftools
bcftools call --ploidy 1 -m -v -o ${output_vcf}_variants.vcf ${output_vcf}_raw.bcf

# Filter and report the SNPs
vcfutils.pl varFilter ${output_vcf}_variants.vcf > ${output_vcf}_final_variants.vcf

# Optionally, visualize the aligned reads (use space key to move around)
samtools tview $sorted_bam_file $reference_genome

echo "Variant calling is complete."