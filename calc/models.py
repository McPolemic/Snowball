from django.db import models

class Account(models.Model):
    name = models.CharField(max_length=50, unique=True)
    initial_balance = models.DecimalField(max_digits=9, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=3)
    overpayments = models.BooleanField(default=True)
    minimum_payment = models.DecimalField(max_digits=9, decimal_places=2)

    def __unicode__(self):
        return name

class Transaction(models.Model):
    account = models.ForeignKey(Account)
    date = models.DateField()
    amount = models.DecimalField(max_digits=9, decimal_places=2)

    def __unicode__(self):
        return '%d/%d/%d - %s' % (date.month, date.day, date.year, account.name)
